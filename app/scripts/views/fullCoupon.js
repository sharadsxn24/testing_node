/**
 * Created by anuraggrover on 29/07/15.
 */

(function (W, D, undefined) {
    'use strict';

    var utils = require('../util/utils'),
        cacheProvider = require('../util/cacheProvider'),
        BaseView = require('./baseView'),
        CouponCollection = require('../collections/coupons'),
        couponCardTemplate = require('raw!../../templates/couponCard.html'),
        fullCouponTemplate = require('raw!../../templates/fullCoupon.html'),
        tncTemplate = require('raw!../../templates/fullCouponTerms.html'),
        faqContent = require('raw!../../templates/faq.html'),
        termsContent = require('raw!../../templates/terms.html'),        
        Mustache = require('../../libs/js/mustache'),
        couponService = require('../util/couponService'),
        couponAnalytics = require('../util/couponAnalytics'),
        platformSdk = require('../../libs/js/platformSdk'),
        BaseModel = require('../models/baseModel'),
        RedeemView = require('./redeemView'),
        Constants = require('../../constants'),
        labels = require('../../labels'),
        Events = Constants.Events,
        _ = require('../../libs/js/lodash.custom.js'),

        handleCouponCodeStyles = function (couponCode) {
            var that = this,
                dummyCodeCtr = that.dummyCodeCtr,
                dummyCtrWidth, scaleFactor, updatedFontSize;

            // Clear any previous value of font size set
            dummyCodeCtr.style.fontSize = '';
            dummyCodeCtr.innerHTML = couponCode;
            dummyCtrWidth = dummyCodeCtr.offsetWidth;

            // Scale down font size for code ctr if width is more than max width allowed
            if (dummyCtrWidth > couponCodeMaxWidth) {
                scaleFactor = couponCodeMaxWidth / dummyCtrWidth;
                updatedFontSize = Math.floor(scaleFactor * Constants.CODE_FONT_SIZE);
                dummyCodeCtr.style.fontSize = updatedFontSize + 'px';

                // If width is still greater than the max width allowed, start reducing font size by 1 unit and check
                while (dummyCodeCtr.offsetWidth > couponCodeMaxWidth) {
                    updatedFontSize -= 1;
                    dummyCodeCtr.style.fontSize = updatedFontSize + 'px';
                }

                that.redeemScreenCtr.querySelector('.coupon-code').style.fontSize = updatedFontSize + 'px';
            }
        },

        showRedeemDialog = function (couponDetails) {
            var that = this,
                renderParams = {
                    code: couponDetails.code,
                    url: couponDetails.base_url
                },
                redeemView;

            renderParams.online = couponDetails.kind === 'online';
            renderParams.isAppOnly = couponDetails.kind === 'app';
            renderParams.hasCode = couponDetails.coupon_type !== 'no_code';

            that.redeemScreenCtr.classList.remove('invisible');

            redeemView = that.redeemView = new RedeemView({
                model: new BaseModel({
                    coupon: that.model.attributes, // ToDo: Move to redeem view, single model
                    couponDetails: renderParams
                }),

                category: that.category,
                bootstrapModel: that.bootstrapModel
            });

            that.redeemScreenCtr.appendChild(redeemView.render().el);
            that.redeemScreenCtr.classList.add('redemption-active');

            if (renderParams.hasCode) {
                handleCouponCodeStyles.call(that, couponDetails.code);
            }
        },

        getRedemptionInfo = function (params) {
            couponService.getConnectionType({
                success: function (connType) {
                    if (connType === Constants.ConnectionTypes.NO_NETWORK) {
                        params.error({
                            noInternet: true
                        });
                    } else {
                        couponService.redeemCoupon({
                            couponId: params.couponId,

                            success: function (response) {
                                params.success(response.coupon);
                            },

                            error: function (response) {
                                params.error(response);
                            }
                        });
                    }
                }
            });
        },

        handleScrollAnalytics = function () {
            var that = this,
                bootstrapModel, scrollDistance, scrollableEl;

            if (that.scrollAnalyticsSent) { return; }

            scrollableEl = that.scrollableEl;
            bootstrapModel = that.bootstrapModel;
            scrollDistance = scrollableEl.scrollTop - that.scrollTop;

            if (Math.abs(scrollDistance) > Constants.MIN_SCROLL_DIST_ANALYTICS) {
                that.scrollAnalyticsSent = true;

                couponAnalytics.logCouponDetailScroll({
                    category: bootstrapModel.getCategoryName(that.category),
                    couponName: that.model.get('merchant_name'),
                    region: bootstrapModel.getSelectedRegionName(),
                    direction: scrollDistance > 0 ? Constants.DIRECTION_DOWN : Constants.DIRECTION_UP
                });
            }
        },

        addEventListeners = function () {
            var that = this;

            that.el.addEventListener('tap', function (e) {
                var targetEl = e.target,
                    model = that.model,
                    bootstrapModel = that.bootstrapModel,
                    redeemBtnEl = targetEl.closest('.redeem-btn');

                if (redeemBtnEl && !redeemBtnEl.classList.contains('loading')) {
                    redeemBtnEl.classList.add('loading');
                    that.xhrStale = false;

                    couponAnalytics.logRedeemClick({
                        category: bootstrapModel.getCategoryName(that.category),
                        couponName: model.get('merchant_name'),
                        offerId: '' + model.id,
                        region: bootstrapModel.getSelectedRegionName()
                    });

                    getRedemptionInfo.call(that, {
                        couponId: model.id,

                        success: function (coupon) {
                            couponAnalytics.logCouponRedemption({
                                category: bootstrapModel.getCategoryName(that.category),
                                couponName: model.get('merchant_name'),
                                couponCode: coupon.code,
                                region: bootstrapModel.getSelectedRegionName()
                            });

                            if (!that.xhrStale) { // If the response comes back after the view has been closed.
                                platformSdk.events.publish(Events.NAVIGATE_APP, {
                                    path: 'redeemCoupon',
                                    coupon: coupon
                                });
                            }
                        },

                        error: function (response) {
                            redeemBtnEl.classList.remove('loading');

                            if (response.noInternet) {
                                platformSdk.events.publish(Events.SHOW_ERR_MSG, labels['app.err.internet']);
                                return;
                            }

                            platformSdk.events.publish(Events.SHOW_ERR_MSG, labels['app.err.redeem']);

                            couponAnalytics.logError({
                                errorCode: response.status_code,
                                errorMsg: 'redeem_coupon',
                                region: that.bootstrapModel.getSelectedRegionName(),
                                couponName: model.get('merchant_name')
                            });
                        }
                    });

                } else if (targetEl.closest('.faq')) {
                    couponAnalytics.logFaqClick();

                    platformSdk.events.publish(Events.NAVIGATE_APP, {
                        path: 'faqs'
                    });
                } else if (targetEl.classList.contains('terms')) {
                    platformSdk.events.publish(Events.NAVIGATE_APP, {
                        path: 'terms'
                    });
                } else if (targetEl.classList.contains('mail-link')) {
                    couponAnalytics.logFullCouponEmailClick();

                    platformSdk.bridge.sendEmail('Coupon related', '', 'support@hike.in');
                }
            });

            that.scrollableEl.addEventListener('scroll', _.debounce(function () {
                handleScrollAnalytics.call(that);
            }, 150));
        },

        handleScreenDims = function () {
            var availableWidth, imgCount, redeemDialogWidth, topPerforationMiddleElWidth, styleEl,
                middlePerforationElWidth;

            if (!screenDimsHandled) {
                availableWidth = W.innerWidth - Constants.REDEEM_DLG_PADDING - 2 * Constants.TICKET_EDGE_ROUND_RADIUS;
                imgCount = Math.floor( availableWidth / Constants.TICKET_EDGE_BG_IMG_WIDTH );
                redeemDialogWidth = imgCount * Constants.TICKET_EDGE_BG_IMG_WIDTH +
                    2 * Constants.TICKET_EDGE_ROUND_RADIUS - Constants.TICKET_EDGE_BG_SOLID_WIDTH;
                redeemDialogWidth = Math.min(Constants.MAX_COUPON_WIDTH, redeemDialogWidth);

                topPerforationMiddleElWidth = redeemDialogWidth - 2 * Constants.TICKET_EDGE_ROUND_RADIUS;
                middlePerforationElWidth = redeemDialogWidth - 2 * Constants.MIDDLE_PERF_WIDTH;

                styleEl = D.createElement('style');
                styleEl.setAttribute('id', 'redeem-styles');
                styleEl.innerHTML = '.redeem-ctr { width:' + redeemDialogWidth + 'px; } .ticket-edge-rounded .middle' +
                    ' { width: ' + topPerforationMiddleElWidth + 'px;}' + ' .mid-perforation .middle { width: ' +
                    middlePerforationElWidth + 'px;}';

                couponCodeMaxWidth = redeemDialogWidth - Constants.REDEEM_DLG_INNER_PADDING;
                D.body.appendChild(styleEl);

                screenDimsHandled = true;
            }
        },

        screenDimsHandled = false,
        couponCodeMaxWidth, FullCouponView;

    FullCouponView = function (options) {
        this.initialize(options);
    };

    FullCouponView.prototype = {
        initialize: function (options) {
            var that = this,
                eventsObj = {};

            that.el = document.createElement('div');
            that.el.className += 'coupon-card-full';
            that.scrollTop = 0;
            BaseView.prototype.initialize.call(that, options);

            eventsObj[Events.SHOW_FAQS] = function (isBackReq) {
                if (isBackReq) {
                    that.el.classList.remove('terms-shown');
                } else {
                    that.el.classList.add('faq-shown');
                }
            };

            eventsObj[Events.SHOW_TERMS] = function () {
                that.el.classList.add('terms-shown');
            };


            that.listenTo(eventsObj);

            handleScreenDims.call(that);
            that.couponCollection = options.collection;
            that.category = options.category;
        },

        removeFaqs: function () {
            this.el.classList.remove('faq-shown');
        },

        removeTerms: function () {
            this.el.classList.remove('terms-shown');
        },

        handleImages: function () {
            var that = this,
                bootstrapModel = that.bootstrapModel,
                imagesEnabled = bootstrapModel.isImageConfigSet() ? bootstrapModel.getImageConfig() :
                    !bootstrapModel.isOptimizationEnabled(),
                model = that.model,
                couponImage = model.attributes.offer_image,
                merchantLogo = model.attributes.merchant_logo,
                cardEl = that.el.querySelector('.coupon-card');

            if (imagesEnabled) {
                utils.loadImage({
                    src: couponImage,
                    success: function () {
                        var imgCtr = cardEl.querySelector('.image');
                        imgCtr.style.backgroundImage = 'url("' + couponImage + '")';

                        // This has been done to fix the transition bug with tint overlays:
                        getComputedStyle(that.el.querySelector('.tint-overlay')).opacity;

                        cardEl.classList.add('image-loaded');
                        cardEl.classList.remove('image-off');
                    }
                });
            } else {
                cardEl.classList.add('image-off');

                setTimeout(function () {
                    var imgEl = cardEl.querySelector('img');
                    imgEl && imgEl.parentNode.removeChild(imgEl);
                }, 250);
            }

            // Load brand logo
            utils.loadImage({
                src: merchantLogo,
                success: function () {
                    that.el.querySelector('.brand-logo div').style.backgroundImage = 'url("' + merchantLogo + '")';
                }
            });

        },

        renderTerms: function(response, loaderEl){
            var el = document.createElement('ul');
            var faqs = this.el.getElementsByClassName('faq-section')[0];

            el.className = "tnc";
            el.innerHTML = Mustache.render(tncTemplate, {tnc: response.split('\n')});

            loaderEl.classList.remove('loading');
            faqs.parentNode.insertBefore(el, faqs);
        },

        getTerms: function(){
            var that = this;
            var faqs = this.el.getElementsByClassName('faq-section')[0];
            var loaderEl = this.el.getElementsByClassName('loader')[0];
            var spin = document.getElementById('loader').cloneNode(true);
            var model;

            loaderEl.appendChild(spin.children[0]);
            loaderEl.classList.add('loading');

            if (this.model.attributes.tnc && this.model.attributes.tnc.length) {
                this.renderTerms(this.model.attributes.tnc, loaderEl);
            } else {

                couponService.fetchTerms({
                    couponId: that.model.id,
                    success: function (response) {
                        response = response.offer.terms;
                        that.model.attributes.tnc = response;

                        model = that.couponCollection.get(that.model.id);
                        model.attributes.tnc = response;

                        that.couponCollection.save();
                        // that.bootstrapModel.save()
                        that.renderTerms(response, loaderEl);
                    },

                    error: function (response) {
                        params.error(response);
                    }
                });
            }
            
        },

        render: function () {
            var that = this;

            Mustache.parse(fullCouponTemplate);
            Mustache.parse(tncTemplate);

            that.el.innerHTML = Mustache.render(fullCouponTemplate, {
                coupon: that.model.attributes
            }, {
                couponCard: couponCardTemplate
            });

            that.el.querySelector('.faq-content').innerHTML = faqContent;
            that.el.querySelector('.terms-content').innerHTML = termsContent;

            that.handleImages();

            that.redeemBtn = that.el.querySelector('.redeem-btn');
            that.redeemScreenCtr = document.querySelector('.redeem-screen-ctr');
            that.scrollableEl = that.el.querySelector('.scrollable');
            that.dummyCodeCtr = that.el.querySelector('.dummy-code-ctr');

            addEventListeners.call(that);

            this.getTerms();

            return that;
        },

        hideRedeemDialog: function () {
            var that = this;

            that.xhrStale = true;

            that.redeemScreenCtr.classList.remove('redemption-active');
            that.el.classList.remove('no-scroll');

            if (that.redeemView) {
                setTimeout(function () {
                    that.redeemView.remove();
                    that.redeemScreenCtr.classList.add('invisible');
                    that.redeemView = undefined;
                }, 300);
            }
        },

        redeemCoupon: function (coupon) {
            var that = this,
                redeemBtnEl = that.redeemBtn;

            redeemBtnEl.classList.remove('loading');
            that.el.classList.add('no-scroll');
            showRedeemDialog.call(that, coupon);
        }
    };

    utils.extend(FullCouponView, BaseView);

    module.exports = FullCouponView;
})(window, document);