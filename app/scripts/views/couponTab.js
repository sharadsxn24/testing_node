/**
 * Created by anuraggrover on 06/08/15.
 */

(function (W, undefined) {
    'use strict';

    var BaseView = require('./baseView'),
        platformSdk = require('../../libs/js/platformSdk'),
        CouponCollection = require('../collections/coupons'),
        _ = require('../../libs/js/lodash.custom.js'),
        utils = require('../util/utils'),
        FullCouponView = require('./fullCoupon'),
        CouponCardView = require('./couponCard'),
        couponAnalytics = require('../util/couponAnalytics'),
        couponService = require('../util/couponService'),
        Constants = require('../../constants'),
        labels = require('../../labels'),
        Events = require('../../constants').Events,
        BOTTOM_BUFFER = 100,
        VISIBLE_LOGO_COUNT = 3,
        MAX_LOGO_EVENTS = 5,

        handleCouponFetchSuccess = function (models) {
            var that = this,
                couponTabEl = that.el,
                bootstrapModel = that.bootstrapModel,
                cardViews = that.cardViews,
                newCardViews = [],
                parentCtr = that.el.parentNode,
                isTabVisible = parentCtr? parentCtr.classList.contains('active') : false,
                isDiwali = bootstrapModel.get('variant') === '2',
                modelOffset = that.modelOffset,
                couponCtr, cardColors;

            couponCtr = document.createDocumentFragment();
            
            models.forEach(function (offer, modelIndex) {
                var color, index;

                modelIndex += modelOffset;

                var featured = modelIndex === 0;
                var coloured = !featured && ( (modelIndex % 4) - 2 < 0 );

                cardColors = isDiwali ?
                    (coloured ? Constants.DIWALI_COUPON_CARD_COLORS : Constants.COUPON_CARD_COLORS) :
                    Constants.COUPON_CARD_COLORS;

                if (isDiwali && coloured) {
                    index = ++that.diwaliColoredIndex;
                } else {
                    index = modelIndex;
                }

                color = cardColors[index % cardColors.length];

                offer.attributes.featured = featured;
                offer.attributes.coloured = coloured;
                offer.attributes.color    = color;

                var cardView = new CouponCardView({
                    model: offer,
                    bootstrapModel: bootstrapModel
                });

                couponCtr.appendChild(cardView.render().el);
                cardViews.push(cardView);
                newCardViews.push(cardView);
            });

            that.modelOffset += models.length;

            couponTabEl.appendChild(couponCtr);

            if (isTabVisible) {
                newCardViews.forEach(function (cardView) {
                    cardView.handleImages();
                });
            }

            if (!that.coupons.hasMore()) {
                platformSdk.events.publish(Events.REMOVE_TAB_STREAMER, that.category);
            }
        },

        handleScrollAnalytics = function (tabCtr) {
            var that = this,
                bootstrapModel, scrollDistance;

            if (that.scrollAnalyticsSent) { return; }

            bootstrapModel = that.bootstrapModel;
            scrollDistance = tabCtr.scrollTop - that.scrollTop;

            if (Math.abs(scrollDistance) > Constants.MIN_SCROLL_DIST_ANALYTICS) {
                that.scrollAnalyticsSent = true;

                couponAnalytics.logCategoryScroll({
                    category: bootstrapModel.getCategoryName(that.category),
                    region: bootstrapModel.getSelectedRegionName(),
                    direction: scrollDistance > 0 ? Constants.DIRECTION_DOWN : Constants.DIRECTION_UP
                });
            }
        },

        addEventListeners = function () {
            var that = this,
                tabStreamEl = that.el,
                parentEl = tabStreamEl.parentNode; // ToDo: Big Tech Debt

            parentEl.addEventListener('scroll', _.debounce(function (e) {
                handleScrollAnalytics.call(that, parentEl);

                if (!that.coupons.hasMore() || parentEl.classList.contains('streaming')) {
                    return;
                }

                if (parentEl.scrollHeight - ( parentEl.offsetHeight + parentEl.scrollTop ) < BOTTOM_BUFFER) {
                    // Load more items.
                    parentEl.classList.add('streaming');

                    couponService.getConnectionType({
                        success: function (connType) {
                            var requestStart = Date.now();

                            if (connType === Constants.ConnectionTypes.NO_NETWORK) {
                                platformSdk.events.publish(Events.SHOW_ERR_MSG, labels['app.err.internet']);

                                parentEl.classList.remove('streaming');

                                return;
                            }

                            that.coupons.fetch({
                                success: function (response) {
                                    var latency = Date.now() - requestStart;

                                    couponAnalytics.logPageChange({
                                        category: that.bootstrapModel.getCategoryName(that.category),
                                        region: that.bootstrapModel.getSelectedRegionName(),
                                        latency: latency,
                                        pageNum: that.coupons.getPage() - 1 // ToDo: fix current page logic
                                    });

                                    handleImageOptimization.call(that, connType);
                                    parentEl.classList.remove('streaming');
                                    handleCouponFetchSuccess.call(that, response.models);
                                },

                                error: function () {
                                    parentEl.classList.remove('streaming');

                                    platformSdk.events.publish(Events.SHOW_ERR_MSG, labels['app.err.streaming']);
                                }
                            });
                        }
                    });
                }
            }, 150), false);

            tabStreamEl.addEventListener('cardLogoLoaded', function (e) {
                var cardIndex = utils.getNodeIndex(e.target),
                    loadEvents = that.loadEvents,
                    logosLoaded = true;

                loadEvents[cardIndex] = true;

                for (var i = 0; i < VISIBLE_LOGO_COUNT; i++) {
                    if (!loadEvents[i]) {
                        logosLoaded = false;
                        break;
                    }
                }

                if (logosLoaded && !that.visibleLogoLoadReported) {
                    that.visibleLogoLoadReported = true;

                    couponAnalytics.logInitVisibleLogosLoaded({
                        category: that.bootstrapModel.getCategoryName(that.category),
                        count: VISIBLE_LOGO_COUNT
                    });
                }
            });
        },

        handleImageOptimization = function (connectionType) {
            var that = this,
                bootstrapModel = that.bootstrapModel,
                toOptimizeImages, currentImageOptimization;

            if (!bootstrapModel.isImageConfigSet()) {
                toOptimizeImages = utils.toOptimizeForImages(connectionType);
                currentImageOptimization = bootstrapModel.isOptimizationEnabled();

                if (currentImageOptimization !== toOptimizeImages) {
                    bootstrapModel.setImageOptimization(toOptimizeImages);
                    platformSdk.events.publish(Events.TOGGLE_IMAGE_OPTIMIZATION, toOptimizeImages);
                }
            } else {
                bootstrapModel.setImageOptimization(!bootstrapModel.getImageConfig());
            }
        },

        handleLogoLoadedEvents = function() {
            var that = this,
                cardViews = that.cardViews,
                retryCounter = 0,

                emitLogoLoadedEvent = function () {
                    var successCount = 0,
                        errorCount = 0;

                    retryCounter++;

                    if (retryCounter >= MAX_LOGO_EVENTS) {
                        return;
                    }

                    cardViews.forEach(function (cardView) {
                        var isMerchantLogoLoaded = cardView.isMerchantLogoLoaded();

                        if (isMerchantLogoLoaded !== undefined) {
                            if (isMerchantLogoLoaded) {
                                successCount++;
                            } else {
                                errorCount++;
                            }
                        }
                    });

                    couponAnalytics.logLogosLoaded({
                        category: that.bootstrapModel.getCategoryName(that.category),
                        successCount: successCount,
                        errorCount: errorCount
                    });

                    if ((successCount + errorCount) < that.cardViews.length) {
                        W.setTimeout(emitLogoLoadedEvent, 5000);
                    }
                };

            W.setTimeout(emitLogoLoadedEvent, 5000);
        },

        CouponTabView;

    CouponTabView = function (options) {
        this.initialize(options);
    };

    CouponTabView.prototype = {
        initialize: function (options) {
            var that = this,
                eventsObj = {};

            that.el = document.createElement('div');
            that.el.classList.add('coupon-tab');
            that.el.classList.add('clearfix');
            that.cardViews = [];
            that.loadEvents = [];
            that.coloredCardIndex = 0;
            that.scrollTop = 0;
            BaseView.prototype.initialize.call(that, options);

            eventsObj[Events.RESET_APP] = function () {
                that.hideRedeemDialog();
                that.fullCouponView && that.fullCouponView.remove();
                that.fullCouponView = undefined;
            };

            that.listenTo(eventsObj);
        },

        render: function () {
            var that = this,
                bootstrapModel = that.bootstrapModel,
                fetchSuccess = function (response) {
                    couponService.getConnectionType({
                        success: function (connectionType) {
                            handleImageOptimization.call(that, connectionType);
                            handleCouponFetchSuccess.call(that, response.models);

                            couponAnalytics.logCodeStep({
                                step: 'couponTabRendered',
                                stepInfo: bootstrapModel.getCategoryName(that.category)
                            });

                            platformSdk.events.publish(Events.REMOVE_TAB_LOADER, that.category);
                            platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                                show: false
                            });
                        }
                    });
                };

            couponAnalytics.logCodeStep({
                step: 'couponTabStartRender',
                stepInfo: bootstrapModel.getCategoryName(that.category)
            });

            that.reset();

            bootstrapModel.onReady(function () {
                var category = that.category,
                    mappedEntry = bootstrapModel.getCouponCollectionMap()[category];

                if (mappedEntry) {
                    that.hasCollection = true;
                    that.coupons = mappedEntry.collection;
                } else {
                    that.coupons = new CouponCollection([], {
                        bootstrapModel: bootstrapModel,
                        category: category
                    });
                }

                if (!that.hasCollection) {
                    that.coupons.fetch({
                        success: fetchSuccess
                    });
                } else {
                    fetchSuccess({
                        models: that.coupons.models
                    });

                    that.coupons.page++; // ToDo: Fix pagenation logic for data coming from bootstrap
                }
            });


            return that;
        },

        postRender: function () {
            addEventListeners.call(this);
        },

        show: function () {
            var that = this;

            if (that.isCollectionDirty()) {
                that.setCollectionClean();
                that.reset();

                that.coupons.fetch({
                    success: function (response) {
                        handleCouponFetchSuccess.call(that, response.models);
                    }
                });
            } else if (that.areImagesDirty()) {
                that.setImagesClean();
                that.handleImages();
            }

            that.el.parentNode.classList.add('active');
        },

        isCollectionDirty: function () {
            return this.isColDirty;
        },

        setCollectionDirty: function () {
            this.isColDirty = true;
        },

        setCollectionClean: function () {
            this.isColDirty = false;
        },

        areImagesDirty: function () {
            return this.imagesDirty;
        },

        setImagesDirty: function () {
            this.imagesDirty = true;
        },

        setImagesClean: function () {
            this.imagesDirty = false;
        },

        handleImages: function () {
            var that = this;

            that.loadEvents.length = that.cardViews.length;

            that.cardViews.forEach(function (cardView) {
                cardView.handleImages();
            });

            handleLogoLoadedEvents.call(that);

            that.fullCouponView && that.fullCouponView.handleImages();
        },

        reset: function () {
            var that = this;

            that.cardViews.forEach(function (cardView) {
                cardView.remove();
            });

            that.modelOffset = that.diwaliColoredIndex = 0;
            that.cardViews = [];
        },

        hide: function () {
            var that = this;

            that.el.parentNode.classList.remove('active');
            that.fullCouponView && that.fullCouponView.remove();
            that.fullCouponView = undefined;
        },

        showFullCoupon: function (params) {
            var that = this,
                bootstrapModel = that.bootstrapModel,
                fullCouponEl = that.fullCouponEl,
                fullCouponView;

            that.fullCouponView && that.fullCouponView.remove();
            that.fullCouponView = undefined;

            couponAnalytics.logCodeStep({
                step: 'couponTabShowFullCoupon'
            });

            couponService.getConnectionType({
                success: function (connType) {
                    var couponId = params.couponId,
                        couponModel = that.coupons.get(couponId);

                    handleImageOptimization.call(that, connType);

                    fullCouponView = that.fullCouponView = new FullCouponView({
                        model: couponModel,
                        bootstrapModel: bootstrapModel,
                        collection: that.coupons,
                        category: that.category
                    });

                    fullCouponEl.appendChild( fullCouponView.render().el );
                    fullCouponEl.classList.add( 'rendered' );
                    fullCouponEl.classList.remove('hidden');

                    couponAnalytics.logCouponDrillDown({
                        category: bootstrapModel.getCategoryName(that.category),
                        couponName: couponModel.get('merchant_name'),
                        region: bootstrapModel.getSelectedRegionName(),
                        couponId: couponId,
                        position: params.position
                    });
                }
            });
        },

        removeFaqs: function () {
            this.fullCouponView.removeFaqs();
        },

        redeemCoupon: function (coupon) {
            this.fullCouponView.redeemCoupon(coupon);
        },

        hideRedeemDialog: function () {
            this.fullCouponView && this.fullCouponView.hideRedeemDialog();
        },

        remove: function () {
            var that = this;

            that.fullCouponView && that.fullCouponView.remove();
            that.fullCouponView = undefined;
            BaseView.prototype.remove.call(that);
        }
    };

    utils.extend(CouponTabView, BaseView);

    module.exports = CouponTabView;
})(window);