/**
 * Created by anuraggrover on 27/07/15.
 */

(function (W, D) {
    'use strict';

    var platformSdk = require('../../libs/js/platformSdk'),
        utils = require('../util/utils'),
        BaseView = require('./baseView'),
        _ = require('../../libs/js/lodash.custom.js'),
        CouponTabView = require('./couponTab'),
        couponAnalytics = require('../util/couponAnalytics'),
        couponStreamTemplate = require('raw!../../templates/couponStream.html'),
        couponService = require('../util/couponService'),
        cacheProvider = require('../util/cacheProvider'),
        Mustache = require('../../libs/js/mustache'),
        //Hammer = require('../../libs/js/hammer'),
        MAX_TIME_SWIPE = 200,
        MIN_DISTANCE_SWIPE = 50,
        Constants = require('../../constants'),
        labels = require('../../labels'),
        Events = Constants.Events,

        showTab = function (categoryKey) {
            var that = this,
                targetEl = that.el.querySelector('.category-tab[data-key="' + categoryKey + '"]'),
                // activeTabIndicator = that.el.querySelector('.category-indicator.active'),
                activeTabSelector;

            if (targetEl.classList.contains('active')) {
                return;
            }

            activeTabSelector = that.el.querySelector('.category-tab.active');
            that.activeTabView && that.activeTabView.hide();
            activeTabSelector && activeTabSelector.classList.remove('active');
            targetEl.classList.add('active');

            // activeTabIndicator && activeTabIndicator.classList.remove('active');
            // that.el.querySelector('.category-indicator[data-key="' + categoryKey + '"]').classList.add('active');

            (that.activeTabView = that.subViewMap[categoryKey]).show();
            that.activeTabView.handleImages();
        },

        logCategorySwitch = function (params) {
            var that = this,
                bootstrapModel = that.bootstrapModel;

            couponAnalytics.logCategorySwitch({
                currentCat: bootstrapModel.getCategoryName(
                    that.el.querySelector('.category-tab.active').getAttribute('data-key')
                ),
                newCat: bootstrapModel.getCategoryName(params.category),
                region: bootstrapModel.getSelectedRegionName(),
                action: params.action
            });
        },

        addEventListeners = function () {
            var that = this,
                streamEl = that.el;

            streamEl.addEventListener('tap', function (e) {
                var targetEl = e.target,
                    tabEl = targetEl.closest('.category-tab');

                if (tabEl && !tabEl.classList.contains('active')) {
                    var newCategory = tabEl.getAttribute('data-key');

                    that.tapEvent = true;

                    logCategorySwitch.call(that, {
                        category: newCategory,
                        action: 'tap'
                    });

                    that.couponStreamEl.classList.add('sliding');
                    slideToTab.call(that, utils.getNodeIndex(tabEl));
                }

            }, false);
        },

        setViewCollectionsDirty = function () {
            var subViewMap = this.subViewMap,
                key;

            for (key in subViewMap) {
                if (subViewMap.hasOwnProperty(key)) {
                    subViewMap[key].setCollectionDirty();
                }
            }
        },

        setViewImagesDirty = function () {
            var subViewMap = this.subViewMap,
                key;

            for (key in subViewMap) {
                if (subViewMap.hasOwnProperty(key)) {
                    subViewMap[key].setImagesDirty();
                }
            }
        },

        reqAnimationFrame = (function () {
            if (W.requestAnimationFrame) {
                return W.requestAnimationFrame;
            } else {
                return function (callback) {
                    setTimeout(callback, 1000 / 60 );
                };
            }
        })(),

        getPanDirection = function (deltaX) {
            return deltaX > 0 ? Hammer.DIRECTION_RIGHT : Hammer.DIRECTION_LEFT;
        },

        isValidSwipe = function (panDirection) {
            var that = this,
                tabLeftCoords = that.swipeData.tabLeftCoords;

            if (that.originX === tabLeftCoords[0] && panDirection === Hammer.DIRECTION_RIGHT) {
                return false;
            }

            if (that.originX === tabLeftCoords[tabLeftCoords.length - 1] && panDirection === Hammer.DIRECTION_LEFT) {
                return false;
            }

            return true;
        },

        handlePan = function (e) {
            var that = this,
                deltaX = e.deltaX;

            // console.log('moved', deltaX);

            if (isValidSwipe.call(that, getPanDirection(deltaX))) {
                slide.call(that, {
                    x: that.originX + deltaX
                });
            }
        },

        revert = function () {
            var that = this;

            slide.call(that, {
                x: that.originX
            }, true );
        },

        getActiveCategoryIndex = function () {
            return utils.getNodeIndex(this.el.querySelector('.category-tab.active'));
        },
        
        handleHammerInput = function (e) {
            var that = this,
                deltaX = e.deltaX,
                activeCategoryIndex = getActiveCategoryIndex.call(that),
                panDirection = getPanDirection(deltaX),
                swipeData = that.swipeData;

            if (!e.isFinal || !isValidSwipe.call(that, panDirection)) {
                return;
            }

            //console.log('input, distance over time and velocity', e.deltaX, e.deltaTime, e.velocity);

            if (e.deltaTime < MAX_TIME_SWIPE && Math.abs(deltaX) > MIN_DISTANCE_SWIPE) {
                if (panDirection === Hammer.DIRECTION_LEFT) { // Next tab
                    showTab.call(that, that.categories[activeCategoryIndex + 1].key);
                } else {
                    showTab.call(that, that.categories[activeCategoryIndex - 1].key);
                }

                return;
            }

            if (Math.abs(deltaX) > swipeData.streamWidth / 2) { // if panned more than half the tab
                if (panDirection === Hammer.DIRECTION_LEFT) { // Next tab
                    showTab.call(that, that.categories[activeCategoryIndex + 1].key);
                } else {
                    showTab.call(that, that.categories[activeCategoryIndex - 1].key);
                }
            } else {
                revert.call(that);
            }
        },

        handleSwipe = function (e) {
            var that = this,
                activeCategoryIndex = getActiveCategoryIndex.call(that);

            //console.log('got swipe');

            if (!isValidSwipe.call(that, e.direction)) {
                return;
            }


            if (e.direction === Hammer.DIRECTION_LEFT) {
                that.swiped = true;
                showTab.call(that, that.categories[activeCategoryIndex + 1].key);
            } else if (e.direction === Hammer.DIRECTION_RIGHT) {
                that.swiped = true;
                showTab.call(that, that.categories[activeCategoryIndex - 1].key);
            }
        },

        slideToTab = function (tabIndex) {
            var that = this;

            that.tabSwipe.slide(tabIndex);
            /*slide.call(that, { x: that.swipeData.tabLeftCoords[tabIndex] }, true);
            that.originX = that.swipeData.tabLeftCoords[tabIndex];*/
        },

        slide = function (translate, animate) {
            var that = this,
                slider = that.slider;//,
                // categoryIndicatorCtr = that.categoryIndCtr;

            if (!slider) {
                return;
            }

            reqAnimationFrame(function () {
                var sliderTranslateValue = 'translateX(' + translate.x + 'px)',
                    tabTranslateValue = 'translateX(' + (-1 * translate.x / 3) + 'px)';

                animate && slider.classList.add('animate');
                animate && categoryIndicatorCtr.classList.add('animate');

                slider.style.webkitTransform = sliderTranslateValue;
                slider.style.transform = sliderTranslateValue;

                // categoryIndicatorCtr.style.webkitTransform = tabTranslateValue;
                // categoryIndicatorCtr.style.transform = tabTranslateValue;
            });
        },

        removeAnimation = function () {
            this.classList.remove('animate');
        },

        setUpSwipe = function () {
            var that = this,
                tabWidth = W.innerWidth,
                hammerManager;

            that.slider = document.getElementById('slider');
            // that.categoryIndCtr = that.el.querySelector('.category-indicator-ctr');

            that.slider.addEventListener('transitionend', removeAnimation, false);
            that.slider.addEventListener('webkitTransitionEnd', removeAnimation, false);
            // that.categoryIndCtr.addEventListener('transitionend', removeAnimation, false);
            // that.categoryIndCtr.addEventListener('webkitTransitionEnd', removeAnimation, false);

            that.originX = 0;

            that.swipeData = {
                streamWidth: tabWidth,
                tabLeftCoords: [0, -tabWidth, -2 * tabWidth]
            };

            hammerManager = new Hammer.Manager(that.slider);

            hammerManager.add(new Hammer.Pan({direction: Hammer.DIRECTION_HORIZONTAL, threshold: 20}));

            hammerManager.on('panstart panmove', function (e) {
                handlePan.call(that, e);
            });

            /*hammerManager.on('swipe', function (e) {
                handleSwipe.call(that, e);
            });*/

            hammerManager.on('hammer.input', function (e) {
                handleHammerInput.call(that, e);
            });
        },

        handleCouponCardStyles = function () {
            var windowWidth = W.innerWidth,
                couponCardStyleEl = D.createElement('style'),
                cardWidth;

            cardWidth = (windowWidth - Constants.TAB_PADDING * 2 - Constants.COUPON_MARGIN) / 2;
            couponCardStyleEl.innerHTML = '.coupon-card .image { width:' + cardWidth + 'px; } ' +
                '.variant-2 .coloured .brand-logo:before{ background-size: 91.5px } .candle { background-size: 13px }';
            couponCardStyleEl.setAttribute('id', 'coupon-tab-styles');
            
            D.body.appendChild(couponCardStyleEl);
        },

        handleVariantStyles = function (appVariant) {
            D.body.classList.add('variant-' + appVariant);
        },
        
        initSubEvents = function () {
            var that = this,
                bootstrapModel = that.bootstrapModel,
                subViewMap = that.subViewMap,
                eventsObj = {};

            eventsObj[Events.SHOW_COUPON] = function (stateObj) {
                var prevState;

                if (stateObj.isBackReq) {
                    prevState = stateObj.prev;

                    if (prevState.path === 'faqs') {
                        that.activeTabView.removeFaqs();
                    } else {
                        that.activeTabView.hideRedeemDialog();
                    }
                } else {
                    couponAnalytics.logCodeStep({
                        step: 'streamShowFullCoupon'
                    });

                    that.activeTabView.showFullCoupon(stateObj.current);
                }
            };

            eventsObj[Events.SHOW_COUPONS] = function (isBackReq) {
                if (isBackReq) {
                    that.activeTabView.hideRedeemDialog();
                }
            };

            eventsObj[Events.REDEEM_COUPON] = function (coupon) {
                that.activeTabView.redeemCoupon(coupon);
            };

            eventsObj[Events.RESET_APP] = function (startTime) {
                that.bootstrapModel.reset({
                    regionId: cacheProvider.getRegionId(),
                    success: function () {
                        that.bootstrapModel.setReady();

                        for (var key in subViewMap) {
                            if (subViewMap.hasOwnProperty(key)) {
                                // Re-render all views.
                                that.subViewMap[key].render();
                            }
                        }

                        platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                            show: false
                        });

                        couponAnalytics.logStreamRefreshedEvent({
                            latency: Date.now() - startTime
                        });
                    },

                    error: function () {
                        platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                            show: false
                        });

                        platformSdk.events.publish(Events.SHOW_ERR_MSG, labels['app.err.offerFetchLocation']);
                    }
                });
            };

            eventsObj[Events.TOGGLE_IMAGES] = function () {
                var imagesEnabled = bootstrapModel.isImageConfigSet() ?
                    bootstrapModel.getImageConfig() :
                    !bootstrapModel.isOptimizationEnabled();

                couponAnalytics.logToggleTextMode(!imagesEnabled);

                bootstrapModel.setImageConfig(!imagesEnabled);
                setViewImagesDirty.call(that);
                that.activeTabView.show();
            };

            eventsObj[Events.REMOVE_TAB_LOADER] = function (category) {
                that.el.querySelector('[data-tab="' + category + '"]').classList.remove('loading');
            };

            eventsObj[Events.REMOVE_TAB_STREAMER] = function (category) {
                that.el.querySelector('[data-tab="' + category + '"]').classList.add('no-more');
            };

            that.listenTo(eventsObj);
        },

        CouponStream;

    CouponStream = function (options) {
        this.initialize(options);
    };

    CouponStream.prototype = {
        initialize: function (options) {
            var that = this,
                bootstrapModel, subViewMap;

            BaseView.prototype.initialize.call(that, options);
            that.el = document.createElement('div');
            that.el.className += 'coupon-stream-ctr';

            bootstrapModel = that.bootstrapModel;

            that.categories = bootstrapModel.getCategories();

            that.subViewMap = {};
            initSubEvents.call(that);
            handleCouponCardStyles();
            handleVariantStyles(bootstrapModel.get('variant'));
        },

        render: function () {
            var that = this;

            couponAnalytics.logCodeStep({
                step: 'couponStreamRender'
            });

            that.el.innerHTML = Mustache.render(couponStreamTemplate, {
                categories: that.categories
            });

            addEventListeners.call(that);

            return that;
        },

        postRender: function () {
            var that = this;

            //setUpSwipe.call(that);

            that.couponStreamEl = that.el.querySelector('.coupon-stream');

            that.bootstrapModel.getCategories().forEach(function (category) {
                var categoryKey = category.key,
                    tabView, tabCtr;

                tabView = that.subViewMap[categoryKey] = new CouponTabView({
                    bootstrapModel: that.bootstrapModel,
                    fullCouponEl: that.fullCouponEl,
                    category: categoryKey
                });

                tabCtr = that.el.querySelector('[data-tab="' + categoryKey + '"]');

                tabCtr.insertBefore(tabView.render().el, tabCtr.firstElementChild);
                tabView.postRender();
            });

            showTab.call(that, 'featured');

            that.tabSwipe = new Swipe(document.getElementById('slider'), {
                startSlide: 0,
                disableScroll: false,
                continuous: false,
                stopPropagation: false,
                callback: function(index, elem) {
                    var newCategory = elem.getAttribute('data-tab');

                    if (!that.tapEvent) {
                        logCategorySwitch.call(that, {
                            category: newCategory,
                            action: 'swipe'
                        });
                    } else {
                        that.tapEvent = false;
                    }

                    showTab.call(that, newCategory);
                },
                transitionEnd: function(index, elem) {
                    that.couponStreamEl.classList.remove('sliding');
                }
            });
        }
    };

    utils.extend(CouponStream, BaseView);

    module.exports = CouponStream;

})(window, document);