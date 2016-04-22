/**
 * Created by anuraggrover on 18/08/15.
 */

(function () {
    'use strict';

    var BaseView = require('./baseView'),
        utils = require('../util/utils'),
        platformSdk = require('../../libs/js/platformSdk'),
        CouponStream = require('./couponStream'),
        RegionsView = require('./regionsView'),
        Constants = require('../../constants'),
        couponAnalytics = require('../util/couponAnalytics'),
        Events = Constants.Events,

        toggleLocationSelector = function () {
            var bootstrapModel = this.bootstrapModel,
                regionCtr = document.querySelector('.regions-screen-ctr');

            if (!regionCtr.classList.contains('visible')) {
                couponAnalytics.logRegionsShowTrigger({
                    currentRegion: bootstrapModel.getSelectedRegionName()
                });
            }

            if (regionsView) {
                regionsView.toggle();
            } else {
                regionsView = new RegionsView({
                    bootstrapModel: bootstrapModel
                });

                regionCtr.appendChild(regionsView.render().el); // ToDo: Use promises
                regionCtr.toggleClass('visible');
            }
        },

        WorkspaceView = function (options) {
            this.initialize(options);
        },

        regionsView, couponStreamView, appCtr, couponsPlaceholder, fullCouponPlaceholder, regionsCtr, loader;

    appCtr = document.getElementById('app-ctr');
    couponsPlaceholder = appCtr.querySelector('.coupons-placeholder');
    fullCouponPlaceholder = appCtr.querySelector('.full-coupon-placeholder');
    regionsCtr = document.querySelector('.regions-screen-ctr');
    loader = document.getElementById('loader');

    WorkspaceView.prototype = {
        initialize: function (options) {
            var that = this,
                eventsObj = {};

            BaseView.prototype.initialize.call(that, options);

            eventsObj[Events.RESET_COUPONS] = function() {
                couponStreamView = undefined;
            };

            eventsObj[Events.SHOW_COUPONS] = function (isBackReq) {
                appCtr.setAttribute('data-step', 'coupons-step');

                if (isBackReq) {
                    couponsPlaceholder.classList.remove('hide');
                    fullCouponPlaceholder.classList.remove('rendered');

                    setTimeout(function () {
                        fullCouponPlaceholder.classList.add('hidden');
                    }, 250);
                    return;
                }

                if (!couponStreamView) {
                    couponStreamView = new CouponStream({
                        fullCouponEl: fullCouponPlaceholder,
                        bootstrapModel: that.bootstrapModel // ToDo: Rename to state model perhaps?
                    });

                    utils.empty(couponsPlaceholder);
                    couponsPlaceholder.appendChild(couponStreamView.render().el);
                    couponStreamView.postRender();
                }
            };

            eventsObj[Events.SHOW_COUPON] = function (stateObj) {
                var isBackReq = stateObj.isBackReq;

                appCtr.setAttribute('data-step', 'full-coupon-step');

                if (!isBackReq) {
                    setTimeout(function () {
                        couponsPlaceholder.classList.add('hide');
                    }, 300);
                } else {
                    fullCouponPlaceholder.classList.remove('hide');
                }
            };

            eventsObj[Events.RESET_APP] = function () {
                appCtr.setAttribute('data-step', 'coupons-step');
                couponsPlaceholder.classList.remove('hide');
                fullCouponPlaceholder.classList.remove('rendered');

                setTimeout(function () {
                    fullCouponPlaceholder.classList.add('hidden');
                }, 250);
            };

            eventsObj[Events.CHANGE_LOCATION] = function () {
                platformSdk.events.publish(Events.NAVIGATE_APP, {
                    path: 'regions'
                });
            };

            eventsObj[Events.TOGGLE_LOCATION_SELECTOR] = function () {
               toggleLocationSelector.call(that);
            };

            eventsObj[Events.UPDATE_APP_LOADER] = function (params) {
                loader.toggleClass('loading', params.show);
            };

            eventsObj[Events.SHOW_ERR_MSG] = function (msg) {
                var appErrMsgEl = document.getElementById('app-err-msg');

                appErrMsgEl.innerText = msg;
                appErrMsgEl.classList.add('visible');
            };

            that.listenTo(eventsObj);

            regionsCtr.addEventListener('regionsToggled', function () {
                regionsCtr.toggleClass('visible');
            }, false);

            document.getElementById('img-opt-msg').addEventListener('webkitAnimationEnd', function () {
                this.classList.remove('visible');
            });

            document.getElementById('app-err-msg').addEventListener('webkitAnimationEnd', function () {
                this.classList.remove('visible');
            });
        }
    };

    utils.extend(WorkspaceView, BaseView);

    module.exports = WorkspaceView;
})();