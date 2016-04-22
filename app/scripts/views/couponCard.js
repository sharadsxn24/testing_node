/**
 * Created by anuraggrover on 29/07/15.
 */

(function () {
    'use strict';

    var BaseView = require('./baseView'),
        utils = require('../util/utils'),
        couponCardTemplate = require('raw!../../templates/couponCard.html'),
        Mustache = require('../../libs/js/mustache'),
        platformSdk = require('../../libs/js/platformSdk'),
        Events = require('../../constants').Events,
        couponAnalytics = require('../util/couponAnalytics'),

        CouponCard = function (options) {
            this.initialize(options);
        },

        addEventListeners = function () {
            var that = this;

            that.el.addEventListener( 'tap', function ( e ) {
                // Open expanded card view for the card.
                couponAnalytics.logCodeStep({
                    step: 'tapCouponForDrilldown'
                });

                platformSdk.events.publish( Events.NAVIGATE_APP, {
                    path: 'coupon',
                    couponId: e.currentTarget.getAttribute('data-id'),
                    position: utils.getNodeIndex(that.el) + 1
                } );
            }, false );
        },

        setImageLoaded = function () {
            this.el.classList.add('image-loaded');
        },

        OBJ_READ_ONLY = {};

    CouponCard.prototype = {
        initialize: function (options) {
            var that = this;

            that.el = document.createElement('div');
            that.el.className += 'coupon-card';
            BaseView.prototype.initialize.call(that, options);
        },

        render: function () {
            var that = this,
                model = that.model,
                cardEl = that.el;

            Mustache.parse(couponCardTemplate);

            cardEl.innerHTML = Mustache.render(couponCardTemplate, {
                coupon: model.attributes
            });

            cardEl.setAttribute('data-id', model.id);
            addEventListeners.call(that);

            return that;
        },

        handleImages: function () {
            var that = this,
                cardEl = that.el,
                model = that.model,
                bootstrapModel = that.bootstrapModel,
                merchantLogo = model.attributes.merchant_logo,
                imagesEnabled, couponImage;

            imagesEnabled = bootstrapModel.isImageConfigSet() ? bootstrapModel.getImageConfig() :
                !bootstrapModel.isOptimizationEnabled();

            if (model.get('coloured')) {
                cardEl.classList.add('coloured');
            }

            if (model.get('featured')){
                cardEl.classList.add('featured');
            }

            if (imagesEnabled) {
                couponImage = that.model.get('offer_image');

                if (couponImage) {
                    utils.loadImage({
                        src: couponImage,
                        success: function () {
                            var imgCtr = cardEl.querySelector('.image');
                            imgCtr.style.backgroundImage = 'url("' + couponImage + '")';
                            setImageLoaded.call(that);
                            cardEl.classList.remove('image-off');
                        },
                        error: function () {
                            setImageLoaded.call(that);
                        }
                    });
                } else {
                    setImageLoaded.call(that);
                }

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
                    var logoLoadedEvent = utils.createCustomEvent('cardLogoLoaded');

                    that.el.querySelector('.brand-logo div').style.backgroundImage = 'url("' + merchantLogo + '")';
                    that.merchantLogoLoaded = true;
                    that.el.dispatchEvent(logoLoadedEvent);
                },
                error: function () {
                    that.merchantLogoLoaded = false;
                }
            });
        },

        isMerchantLogoLoaded: function () {
            return this.merchantLogoLoaded;
        }
    };

    utils.extend(CouponCard, BaseView);

    module.exports = CouponCard;

})();