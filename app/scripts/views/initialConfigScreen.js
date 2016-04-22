/**
 * Created by anuraggrover on 03/08/15.
 */

(function (W) {
    'use strict';

    var BaseView = require('./baseView'),
        utils = require('../util/utils'),
        Mustache = require('../../libs/js/mustache'),
        cacheProvider = require('../util/cacheProvider'),
        initialConfigScreenTemplate = require('raw!../../templates/initialConfigScreen.html'),
        couponService = require('../util/couponService'),
        couponAnalytics = require('../util/couponAnalytics'),
        platformSdk = require('../../libs/js/platformSdk'),
        Constants = require('../../constants'),
        Events = Constants.Events,
        SUB_FAIL_KEY = 'subFail',
        UNSUB_FAIL_KEY = 'unSubFail',

        triggerBootstrapFetch = function (regionId) {
            var that = this,
                bootstrapModel = that.bootstrapModel,
                startTime = Date.now();

            cacheProvider.get({
                key: 'bootstrapData',
                success: function(res){
                    
                    try {
                        res = decodeURIComponent(res);
                    } catch(e) {
                        // res = false;
                    }

                    try {
                        res = JSON.parse(res)
                    } catch(e) {
                        res = undefined;
                    }

                    console.log("Get Data from Cache", res);

                    bootstrapModel.fetch({
                        response: res,
                        success: function(){
                            platformSdk.events.publish(Events.NAVIGATE_APP);            // Let router determine where to navigate

                            couponAnalytics.logLoadingDoneEvent({
                                latency: Date.now() - startTime
                            });        
                        }
                    }, res && res != "undefined" ? true : false);
                }, 
                error: function(res){
                    bootstrapModel.fetch({
                        regionId: regionId,

                        success: function () {
                            platformSdk.events.publish(Events.NAVIGATE_APP);    // Let router determine where to navigate

                            couponAnalytics.logLoadingDoneEvent({
                                latency: Date.now() - startTime
                            });
                        },

                        error: function () {
                            // Failed to load app
                            platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                                show: false
                            });
                            that.el.classList.add('boot-failed');
                            that.show();
                        }
                    });
                }
            });
        },

        navigateToApp = function () {
            var that = this,
                bootstrapModel = that.bootstrapModel;

            couponService.getConnectionType({
                success: function (connectionType) {
                    var regionId;

                    if (connectionType === Constants.ConnectionTypes.NO_NETWORK) {
                        couponAnalytics.logError({
                            errorCode: -1,
                            errorMsg: 'no_internet_on_app_load'
                        });

                        that.show();
                        that.el.classList.add('no-network');
                        resetOverflowMenu.call(that, true);

                        platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                            show: false
                        });
                    } else {
                        that.el.classList.remove('no-network');
                        that.hide();
                        resetOverflowMenu.call(that, false);

                        platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                            show: true
                        });

                        if (!bootstrapModel.isReady()) {
                            regionId = cacheProvider.getRegionId();

                            // App loading event should be fired before region call when not found in cache.
                            couponAnalytics.logLoadingInProgressEvent();

                            if (regionId !== undefined && regionId !== null) {
                                couponAnalytics.logCodeStep({
                                    step: 'userRegionIsInCache'
                                });

                                triggerBootstrapFetch.call(that, regionId);
                            } else {
                                couponAnalytics.logCodeStep({
                                    step: 'fetchingUserRegion'
                                });

                                couponService.getSelectedRegion({
                                    success: function (response) {
                                        var regionId = response.region_id;

                                        if (regionId !== undefined && regionId !== null) {
                                            cacheProvider.setInCritical('regionId', regionId);
                                        }

                                        triggerBootstrapFetch.call(that, regionId);
                                    },

                                    error: function (response) {
                                        couponAnalytics.logError({
                                            errorCode: response.errorCode,
                                            errorMsg: 'get_user_region'
                                        });

                                        triggerBootstrapFetch.call(that);
                                    }
                                });
                            }
                        } else {
                            platformSdk.events.publish(Events.NAVIGATE_APP); // Let router determine where to navigate
                        }
                    }
                }
            });
        },

        subscribeToApp = function () {
            couponService.subUnSub({
                optIn: true,

                success: function () {
                    cacheProvider.set(SUB_FAIL_KEY, 'false');
                },

                error: function () {
                    cacheProvider.set(SUB_FAIL_KEY, 'true');
                }
            });
        },

        unsubscribeFromApp = function () {
            couponService.subUnSub({
                optIn: false,

                success: function () {
                    cacheProvider.set(UNSUB_FAIL_KEY, 'false');
                },

                error: function () {
                    cacheProvider.set(UNSUB_FAIL_KEY, 'true');
                }
            });
        },

        blockApp = function () {
            var that = this;

            utils.toggleBackNavigation(false);
            that.bootstrapModel.toggleBlocked(true);
            that.showBlocked();

            /**
             * Very important section which updates state of the app in three different places
             * 1. Native Block
             * 2. Unsubscribe call
             * 3. Analytics
             */
            platformSdk.blockChatThread();
            //unsubscribeFromApp();
            couponAnalytics.logBlock();

            resetOverflowMenu.call(that);
        },

        unblockApp = function () {
            var that = this,
                bootstrapModel = that.bootstrapModel;

            bootstrapModel.toggleBlocked(false);
            that.el.classList.remove('blocked');

            /**
             * Very important section which updates state of the app in three different places
             * 1. Native Unblock
             * 2. Subscribe call if opt in has been done
             * 3. Analytics
             */
            platformSdk.unblockChatThread();

            /*if (bootstrapModel.isOptInDone()) {
                subscribeToApp();
            }*/

            couponAnalytics.logUnblock();

            resetOverflowMenu.call(that);
            handleOptIn.call(that);
        },

        addEventListeners = function () {
            var that = this;

            that.el.addEventListener('tap', function (e) {
                var targetEl = e.target,
                    bootstrapModel = that.bootstrapModel;

                if (targetEl.classList.contains('opt-in-btn')) {
                    /**
                     * Very important section which updates state of the app in two places
                     * 1. Subscribe call
                     * 2. Analytics
                     */
                    subscribeToApp();
                    couponAnalytics.logOptIn({
                        optIn: true
                    });

                    bootstrapModel.setOptIn(true);
                    resetOverflowMenu.call(that);
                    navigateToApp.call(that);
                } else if (targetEl.classList.contains('block-link')) {
                    couponAnalytics.logOptIn({
                        optIn: false
                    });

                    blockApp.call(that);
                } else if (targetEl.classList.contains('unblock-btn')) {
                    unblockApp.call(that);
                } else if (targetEl.classList.contains('next')) {
                    navigateToApp.call(that);
                } else if (targetEl.classList.contains('retry-network-btn')) {
                    navigateToApp.call(that);
                } else if (targetEl.classList.contains('retry-boot-btn')) {
                    navigateToApp.call(that);
                }

            }, false);
        },

        handleOptIn = function () {
            var that = this,
                bootstrapModel = that.bootstrapModel;

            if (bootstrapModel.isOptInDone()) {
                couponAnalytics.logCodeStep({
                    step: 'optInIsDone'
                });

                navigateToApp.call(that);
            } else {
                couponAnalytics.logCodeStep({
                    step: 'showOptIn'
                });

                that.show();
                couponAnalytics.logShowOptIn();
            }
        },

        resetOverflowMenu = function (disableMenu) {
            var that = this,
                bootstrapModel = that.bootstrapModel,
                isBlocked = bootstrapModel.isAppBlocked(),

                imagesEnabled = bootstrapModel.isImageConfigSet() ? bootstrapModel.getImageConfig() :
                    !bootstrapModel.isOptimizationEnabled(),

                overflowMenuItems;

            disableMenu = !!disableMenu;

            if (bootstrapModel.isOptInDone()) {
                if (isBlocked) {
                    overflowMenuItems = [
                        {
                            title: 'Unblock',
                            en: !disableMenu,
                            eventName: Events.TOGGLE_BLOCK
                        }
                    ];
                } else {
                    overflowMenuItems = [
                        {
                            title: 'Block',
                            en: !disableMenu,
                            eventName: Events.TOGGLE_BLOCK
                        },
                        {
                            title: 'Change Location',
                            en: !disableMenu,
                            eventName: Events.CHANGE_LOCATION
                        },
                        {
                            title: 'Show Images',
                            en: !disableMenu,
                            is_checked: imagesEnabled ? 'true' : 'false',
                            eventName: Events.TOGGLE_IMAGES
                        }
                    ];
                }
            } else {
                overflowMenuItems = [
                    {
                        title: isBlocked ? 'Unblock' : 'Block',
                        en: !disableMenu,
                        eventName: Events.TOGGLE_BLOCK
                    }
                ];
            }

            platformSdk.setOverflowMenu(overflowMenuItems);
        },

        // Checks if sub/unsub calls had failed in the past and if true, fires calls again.
        handleSubUnSubState = function () {
            cacheProvider.get({
                key: SUB_FAIL_KEY,
                success: function (failed) {
                    if (failed === 'true') {
                        subscribeToApp();
                    }
                },
                error: function(){

                }
            });

            cacheProvider.get({
                key: UNSUB_FAIL_KEY,
                success: function (failed) {
                    if (failed === 'true') {
                        unsubscribeFromApp();
                    }
                },
                error: function(){

                }
            });
        };

    var OptInScreenView = function (options) {
        this.initialize(options);
    };

    OptInScreenView.prototype = {
        initialize: function (options) {
            var that = this,
                eventsConfig = {};

            BaseView.prototype.initialize.call(that, options);
            that.el = document.createElement('div');
            that.el.classList.add('opt-in-screen');
            handleSubUnSubState();

            eventsConfig[Events.TOGGLE_BLOCK] = function () {
                if (that.bootstrapModel.isAppBlocked()) {
                    unblockApp.call(that);
                } else {
                    blockApp.call(that);
                }
            };

            eventsConfig[Events.TOGGLE_IMAGE_OPTIMIZATION] = function (enable) {
                var toggleImagesItemId = '' + platformSdk.retrieveId(Events.TOGGLE_IMAGES);

                if (enable) {
                    document.getElementById('img-opt-msg').classList.add('visible');
                }

                platformSdk.updateOverflowMenu(toggleImagesItemId, {
                    "is_checked": '' + !enable
                });
            };

            that.listenTo(eventsConfig);
        },

        render: function () {
            var that = this;

            that.el.innerHTML = Mustache.render(initialConfigScreenTemplate);
            addEventListeners.call(that);

            return that;
        },

        postRender: function () {
            var that = this;

            couponAnalytics.logCodeStep({
                step: 'optInPostRender'
            });

            if (that.bootstrapModel.isAppBlocked()) {
                couponAnalytics.logCodeStep({
                    step: 'optInAppBlocked'
                });

                that.showBlocked();
            } else {
                couponAnalytics.logCodeStep({
                    step: 'handleOptIn'
                });

                handleOptIn.call(that);
            }

            resetOverflowMenu.call(that);
        },

        showBlocked: function () {
            this.el.classList.add('blocked');
            this.show();
        },

        show: function () {
            platformSdk.events.publish(Events.UPDATE_APP_LOADER, {
                show: false
            });

            this.el.parentNode.classList.remove('hide');
        },

        hide: function () {
            this.el.parentNode.classList.add('hide');
        }
    };

    utils.extend(OptInScreenView, BaseView);

    module.exports = OptInScreenView;

})(window);