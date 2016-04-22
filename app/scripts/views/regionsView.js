/**
 * Created by anuraggrover on 04/08/15.
 */

(function () {
    'use strict';

    var BaseView = require('./baseView'),
        utils = require('../util/utils'),
        platformSdk = require('../../libs/js/platformSdk'),
        regionsTemplate = require('raw!../../templates/regions.html'),
        regionItemsTemplate = require('raw!../../templates/regionItems.html'),
        Mustache = require('../../libs/js/mustache'),
        couponService = require('../util/couponService'),
        couponAnalytics = require('../util/couponAnalytics'),
        cacheProvider = require('../util/cacheProvider'),
        Constants = require('../../constants'),
        Events = Constants.Events,
        labels = require('../../labels'),

        simulateBackPress = function () {
            platformSdk.events.publish('onBackPressed'); // Simulate back pressed for correct history handling.
        },

        addEventListeners = function () {
            var that = this,
                bootstrapModel = that.bootstrapModel;

            that.el.addEventListener('tap', function (e) {
                var targetEl = e.target,

                    toggleRegionSelection = function (toSelect) {
                        that.el.querySelector('[data-region="' + currentRegionId + '"]').toggleClass('active', !toSelect);
                        that.el.querySelector('[data-region="' + selectedRegionId + '"]').toggleClass('active', toSelect);
                    },

                    regionItemEl = targetEl.closest('.region-item'),
                    currentRegionId, selectedRegionId;

                if (regionItemEl) {
                    if (regionItemEl.classList.contains('active')) {
                        simulateBackPress();
                    } else {
                        currentRegionId = bootstrapModel.getSelectedRegionId();
                        selectedRegionId = regionItemEl.getAttribute('data-region');

                        couponAnalytics.logRegionChange({
                            currentRegion: bootstrapModel.getSelectedRegionName(),
                            newRegion: bootstrapModel.getRegionName(selectedRegionId)
                        });

                        toggleRegionSelection(true);

                        couponService.getConnectionType({
                            success: function (connType) {
                                var startTime;

                                if (connType === Constants.ConnectionTypes.NO_NETWORK) {
                                    platformSdk.events.publish(Events.SHOW_ERR_MSG, labels['app.err.internet']);
                                    simulateBackPress();
                                    toggleRegionSelection(false);
                                } else {
                                    startTime = Date.now();
                                    couponAnalytics.logStreamRefreshingEvent();

                                    platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                                        show: true
                                    });

                                    couponService.setSelectedRegion({
                                        regionId: selectedRegionId,
                                        success: function () {
                                            that.toggle();
                                            cacheProvider.setInCritical('regionId', selectedRegionId);
                                            platformSdk.events.publish(Events.RESET_APP, startTime);
                                        },
                                        error: function (res) {
                                            toggleRegionSelection(false);

                                            platformSdk.events.publish(Events.SHOW_ERR_MSG,
                                                labels['app.err.locationUpdate']);
                                            simulateBackPress();

                                            couponAnalytics.logError({
                                                errorCode: res.status_code,
                                                errorMsg: 'set_region'
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    }
                } else if (targetEl.classList.contains('close')) {
                    simulateBackPress();
                } else if (targetEl.classList.contains('retry-regions-btn')) {
                    fetchAndRenderRegions.call(that);
                } else if (!targetEl.closest('.regions-content')) {
                    simulateBackPress();
                }
            }, false);
        },

        logRegionsViewShowEvent = function () {
            couponAnalytics.logRegionSelectorShown({
                currentRegion: this.bootstrapModel.getSelectedRegionName()
            });
        },

        handleActiveItem = function () {
            var that = this,
                regionItemsCtr = that.el.querySelector('.region-item-ctr'),
                parentEl = that.el.parentNode;

            if (!that.rendered) {
                fetchAndRenderRegions.call(that);
                return;
            }

            if (!parentEl) {
                logRegionsViewShowEvent.call(that);

                setTimeout(function () {
                    // Scroll to active element
                    regionItemsCtr.scrollTop = regionItemsCtr.querySelector('.active').offsetTop;
                }, 100);
            } else {
                // Scroll to active element
                regionItemsCtr.scrollTop = regionItemsCtr.querySelector('.active').offsetTop;

                if (parentEl.classList.contains('visible')) {
                    logRegionsViewShowEvent.call(that);
                }
            }
        },

        fireToggleEvent = function () {
            var that = this,
                regionToggleEvent = utils.createCustomEvent('regionsToggled');

            that.el.dispatchEvent(regionToggleEvent);
        },

        fetchAndRenderRegions = function () {
            var that = this,
                regionsCtrEl = that.el,
                bootstrapModel = that.bootstrapModel,
                regionCollection = bootstrapModel.getRegions();

            regionsCtrEl.classList.remove('no-internet');
            regionsCtrEl.classList.remove('load-error');

            couponService.getConnectionType({
                success: function (connType) {
                    if (connType === Constants.ConnectionTypes.NO_NETWORK) {
                        regionsCtrEl.classList.remove('loading');
                        regionsCtrEl.classList.add('no-internet');
                    } else {
                        regionsCtrEl.classList.add('loading'); // ToDo: find better way for classlist interface.

                        regionCollection.fetch({
                            success: function (response) {
                                var regions = response.regions,
                                    selectedRegion = bootstrapModel.getSelectedRegionId();

                                regionCollection.fetchSuccess(regions);
                                regionsCtrEl.classList.remove('loading');

                                that.el.querySelector('.region-item-ctr').innerHTML = Mustache.render(regionItemsTemplate, {
                                    regions: regions
                                });

                                regionsCtrEl.querySelector('[data-region="' + selectedRegion + '"]').classList.add('active');
                                that.rendered = true;
                                handleActiveItem.call(that);
                            },
                            error: function (response) {
                                couponAnalytics.logError({
                                    errorCode: response.errorCode,
                                    errorMsg: 'get_regions_list'
                                });

                                regionsCtrEl.classList.remove('loading');
                                regionsCtrEl.classList.add('load-error');
                            }
                        });
                    }
                }
            });
        },

        RegionsView;

    RegionsView = function (options) {
        this.initialize(options);
    };

    RegionsView.prototype = {
        initialize: function (options) {
            var that = this;

            that.el = document.createElement('div');
            that.el.className += 'regions-ctr loading';

            BaseView.prototype.initialize.call(that, options);
        },

        render: function () {
            var that = this;

            that.el.innerHTML = Mustache.render(regionsTemplate);

            addEventListeners.call(that);
            fireToggleEvent.call(that);
            fetchAndRenderRegions.call(that);

            return that;
        },

        toggle: function () {
            var that = this;

            fireToggleEvent.call(that);
            handleActiveItem.call(that);
        }
    };

    utils.extend(RegionsView, BaseView);

    module.exports = RegionsView;
})();