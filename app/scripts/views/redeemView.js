/**
 * Created by anuraggrover on 06/09/15.
 */

(function () {
    'use strict';

    var BaseView = require('./baseView'),
        Mustache = require('../../libs/js/mustache'),
        redeemTemplate = require('raw!../../templates/redeemDialog.html'),
        platformSdk = require('../../libs/js/platformSdk'),
        couponAnalytics = require('../util/couponAnalytics'),
        utils = require('../util/utils'),

        RedeemView = function(options) {
            this.initialize(options);
        },

        simulateBackPress = function () {
            platformSdk.events.publish('onBackPressed'); // Simulate back press for correct history handling.
        },

        addEventListeners = function () {
            var that = this;

            that.el.addEventListener('tap', function (e) {
                var targetEl = e.target,
                    merchantName = that.model.get('coupon').merchant_name;

                if (targetEl.closest('.redeem-close-ctr')) {
                    simulateBackPress();
                } else if (targetEl.classList.contains('merchant-link')) {
                    couponAnalytics.logVisitWebsite({
                        category: that.bootstrapModel.getCategoryName(that.category),
                        couponName: merchantName,
                        region: that.bootstrapModel.getSelectedRegionName()
                    });

                    platformSdk.openFullPage(merchantName, targetEl.getAttribute('href'));
                } else if (targetEl.classList.contains('mail-link')) {
                    couponAnalytics.logRedeemEmailClick();

                    platformSdk.bridge.sendEmail('Redemption related', '', 'support@hike.in');
                } else if (!targetEl.closest('.redeem-ctr')) {
                    simulateBackPress();
                }
            }, false);
        };

    Mustache.parse(redeemTemplate);

    RedeemView.prototype = {
        initialize: function (options) {
            var that = this;

            that.el = document.createElement('div');
            that.el.classList.add('redeem-dialog-ctr');

            BaseView.prototype.initialize.call(that, options);
        },

        render: function () {
            var that = this;

            that.el.innerHTML = Mustache.render(redeemTemplate, that.model.attributes);

            addEventListeners.call(that);

            return that;
        }
    };

    utils.extend(RedeemView, BaseView);

    module.exports = RedeemView;
})();