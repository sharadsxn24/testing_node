(function (window) {
    'use strict';

    var messageId,

        /**
         * Creates wrappers on bridge object for the list of methods provided.
         * @param {Object} bridgeObj - The bridge object being built with methods as per platform version
         * @param {Object[]} methodList - List of methods for which wrappers need to be created
         * @private
         */
        _createWrappers = function (bridgeObj, methodList) {
            var wrapper = function () {
                var args = Array.prototype.slice.call(arguments);
                _invokeMethod.apply(null, args);
            },
                methodKey;

            for (var i = 0; i < methodList.length; i++) {
                methodKey = methodList[i];
                bridgeObj[methodKey] = wrapper.bind(null, methodKey);
            }
        },

        /**
         * Fallback for method not being available on Android Bridge.
         * @private
         */
        _handleMethodNotAvailable = function () {
            if (console) {
                console.log("function not available");
            }
        },

        /**
         * Invokes method on Android Bridge
         * @param {string} methodName The name of the method to be invoked
         * @private
         */
        _invokeMethod = function (methodName) {
            if (typeof PlatformBridge[methodName] === 'function') {
                PlatformBridge[methodName].apply(PlatformBridge, Array.prototype.slice.call(arguments, 1));
            } else {
                _handleMethodNotAvailable();
            }
        };

    /*
     _______  _______  __   __  __   __  _______  __    _    _______  ______    ___   ______   _______  _______    __   __  _______  _______  __   __  _______  ______   _______
     |       ||       ||  |_|  ||  |_|  ||       ||  |  | |  |  _    ||    _ |  |   | |      | |       ||       |  |  |_|  ||       ||       ||  | |  ||       ||      | |       |
     |       ||   _   ||       ||       ||   _   ||   |_| |  | |_|   ||   | ||  |   | |  _    ||    ___||    ___|  |       ||    ___||_     _||  |_|  ||   _   ||  _    ||  _____|
     |       ||  | |  ||       ||       ||  | |  ||       |  |       ||   |_||_ |   | | | |   ||   | __ |   |___   |       ||   |___   |   |  |       ||  | |  || | |   || |_____
     |      _||  |_|  ||       ||       ||  |_|  ||  _    |  |  _   | |    __  ||   | | |_|   ||   ||  ||    ___|  |       ||    ___|  |   |  |       ||  |_|  || |_|   ||_____  |
     |     |_ |       || ||_|| || ||_|| ||       || | |   |  | |_|   ||   |  | ||   | |       ||   |_| ||   |___   | ||_|| ||   |___   |   |  |   _   ||       ||       | _____| |
     |_______||_______||_|   |_||_|   |_||_______||_|  |__|  |_______||___|  |_||___| |______| |_______||_______|  |_|   |_||_______|  |___|  |__| |__||_______||______| |_______|

     */

    var _commonBridgeMethods = {
        ver0: [
            /**
             * Platform Bridge Version 0 Call this function to log analytics events.
             * @method logAnalytics
             * @memberOf platformSdk.bridge
             * @param {string} isUI
             * @param {string} subType
             * @param {string} json Stringifed json object
             */
            'logAnalytics',

            /**
             * Platform Bridge Version 0 calling this function will generate logs for testing at the android IDE.
             * @method logFromJS
             * @memberOf platformSdk.bridge
             * @param {string} tag
             * @param {string} data
             */
            'logFromJS',

            /**
             * Platform Bridge Version 0 This function is called whenever the onLoadFinished of the html is called.
             * @method onLoadFinished
             * @memberOf platformSdk.bridge
             * @param {string} height
             */
            'onLoadFinished',

            /**
             * Platform bridge Version 0 Call this function to open a full page webView within hike.
             * @method openFullPage
             * @memberOf platformSdk.bridge
             * @param {string} title
             * @param {string} url
             */
            'openFullPage',

            /**
             * Platform Bridge Version 0 call this function with parameter as true to enable the debugging for javascript.
             * @method setDebuggableEnabled
             * @memberOf platformSdk.bridge
             * @param {string} enabled
             */
            'setDebuggableEnabled',

            /**
             * Platform Bridge Version 0 calling this function will share the screenshot of the webView along with the text at the top and a caption text to all social network platforms by calling the system's intent.
             * @method share
             * @memberOf platformSdk.bridge
             * @param {string} text
             * @param {string} caption
             */
            'share',

            /**
             * Platform Bridge Version 0 calling this function will share the screenshot of the webView along with the text at the top and a caption text to all social
             * @method showToast
             * @memberOf platformSdk.bridge
             * @param {string} toast
             */
            'showToast',

            /**
             * Platform Bridge Version 0 This function can be used to start a hike native contact chooser/picker which will show all hike contacts to user and user
             * @method startContactUser
             * @memberOf platformSdk.bridge
             */
            'startContactChooser',

            /**
             * Platform Bridge Version 0 Call this function to vibrate the device.
             * @method vibrate
             * @memberOf platformSdk.bridge
             */
            'vibrate'
        ],

        ver1: [
            /**
             * Platform Bridge Version 1 call this function to open a web page in the default browser.
             * @method openPageInBrowser
             * @memberOf platformSdk.bridge
             * @param {string} url
             */
            'openPageInBrowser'
        ],

        ver3: [
            /**
             * Platform Bridge Version 3 Call this function to send email.
             * @method sendEmail
             * @memberOf platformSdk.bridge
             * @param {string} subject
             * @param {string} body
             * @param {string} sendTo
             */
            'sendEmail',

            /**
             * Platform Bridge Version 3 Call this function to enable zooming in webViews.
             * @method setZoomEnabled
             * @memberOf platformSdk.bridge
             * @param {string} enabled
             */
            'setZoomEnabled'
        ],

        ver5: [
            /**
             * Platform Bridge version 5 To download sticker pack
             * @method downloadStkPack
             * @memberOf platformSdk.bridge
             * @param {string} stickerData
             */
            'downloadStkPack', // Platform Bridge version 5 To download sticker pack

            /**
             * Platform Bridge version 5
             * @method sendMultiFwdSticker
             * @memberOf platformSdk.bridge
             * @param {string} stickerData
             */
            'sendMultiFwdSticker'
        ],

        ver6: [
            /**
             * Platform Bridge version 6 Call this function to close the current activity.
             * @method closeWebView
             * @memberOf platformSdk.bridge
             */
            'closeWebView'
        ]
    };

    /*
     __   __  _______  _______  _______  _______  _______  ___   __    _  _______    _______  ______    ___   ______   _______  _______    __   __  _______  _______  __   __  _______  ______   _______
     |  |_|  ||       ||       ||       ||   _   ||       ||   | |  |  | ||       |  |  _    ||    _ |  |   | |      | |       ||       |  |  |_|  ||       ||       ||  | |  ||       ||      | |       |
     |       ||    ___||  _____||  _____||  |_|  ||    ___||   | |   |_| ||    ___|  | |_|   ||   | ||  |   | |  _    ||    ___||    ___|  |       ||    ___||_     _||  |_|  ||   _   ||  _    ||  _____|
     |       ||   |___ | |_____ | |_____ |       ||   | __ |   | |       ||   | __   |       ||   |_||_ |   | | | |   ||   | __ |   |___   |       ||   |___   |   |  |       ||  | |  || | |   || |_____
     |       ||    ___||_____  ||_____  ||       ||   ||  ||   | |  _    ||   ||  |  |  _   | |    __  ||   | | |_|   ||   ||  ||    ___|  |       ||    ___|  |   |  |       ||  |_|  || |_|   ||_____  |
     | ||_|| ||   |___  _____| | _____| ||   _   ||   |_| ||   | | | |   ||   |_| |  | |_|   ||   |  | ||   | |       ||   |_| ||   |___   | ||_|| ||   |___   |   |  |   _   ||       ||       | _____| |
     |_|   |_||_______||_______||_______||__| |__||_______||___| |_|  |__||_______|  |_______||___|  |_||___| |______| |_______||_______|  |_|   |_||_______|  |___|  |__| |__||_______||______| |_______|

     */

    var _msgBridgeMethods = {
        ver0: [
            /**
             * Platform Bridge Version 0 calling this function will delete the alarm associated with this javascript.
             * @method deleteAlarm
             * @memberOf platformSdk.bridge
             */
            'deleteAlarm',

            /**
             * Platform Bridge Version 0 call this function to delete the message.
             * @method deleteMessage
             * @memberOf platformSdk.bridge
             */
            'deleteMessage',

            /**
             * Platform Bridge Version 0 Calling this function will initiate forward of the message to a friend or group.
             * @method forwardToChat
             * @memberOf platformSdk.bridge
             * @param {string} json
             */
            'forwardToChat',

            /**
             * Platform Bridge Version 0 calling this method will forcefully mute the chat thread.
             * @method muteChatThread
             * @memberOf platformSdk.bridge
             */
            'muteChatThread',

            /**
             * Platform Bridge Version 0 Call this function to set the alarm at certain time that is defined by the second parameter.
             * @method setAlarm
             * @memberOf platformSdk.bridge
             * @param {string} json Stringified json
             * @param {string} timeInMillis
             */
            'setAlarm',

            /**
             * Platform Bridge Version 0
             * @method share
             * @memberOf platformSdk.bridge
             */
            'share',

            /**
             * Platform Bridge Version 0 this function will update the helper data.
             * @method updateHelperData
             * @memberOf platformSdk.bridge
             * @param {string} json Stringified json
             */
            'updateHelperData',

            /**
             * Platform Bridge Version 0 Calling this function will update the metadata.
             * @method updateMetaData
             * @memberOf platformSdk.bridge
             * @param {string} json
             * @param {string} notifyScreen
             */
            'updateMetadata'
        ]
    };

    /*
     __    _  _______  __    _         __   __  _______  _______  _______  _______  _______  ___   __    _  _______    _______  ______    ___   ______   _______  _______    __   __  _______  _______  __   __  _______  ______   _______
     |  |  | ||       ||  |  | |       |  |_|  ||       ||       ||       ||   _   ||       ||   | |  |  | ||       |  |  _    ||    _ |  |   | |      | |       ||       |  |  |_|  ||       ||       ||  | |  ||       ||      | |       |
     |   |_| ||   _   ||   |_| | ____  |       ||    ___||  _____||  _____||  |_|  ||    ___||   | |   |_| ||    ___|  | |_|   ||   | ||  |   | |  _    ||    ___||    ___|  |       ||    ___||_     _||  |_|  ||   _   ||  _    ||  _____|
     |       ||  | |  ||       ||____| |       ||   |___ | |_____ | |_____ |       ||   | __ |   | |       ||   | __   |       ||   |_||_ |   | | | |   ||   | __ |   |___   |       ||   |___   |   |  |       ||  | |  || | |   || |_____
     |  _    ||  |_|  ||  _    |       |       ||    ___||_____  ||_____  ||       ||   ||  ||   | |  _    ||   ||  |  |  _   | |    __  ||   | | |_|   ||   ||  ||    ___|  |       ||    ___|  |   |  |       ||  |_|  || |_|   ||_____  |
     | | |   ||       || | |   |       | ||_|| ||   |___  _____| | _____| ||   _   ||   |_| ||   | | | |   ||   |_| |  | |_|   ||   |  | ||   | |       ||   |_| ||   |___   | ||_|| ||   |___   |   |  |   _   ||       ||       | _____| |
     |_|  |__||_______||_|  |__|       |_|   |_||_______||_______||_______||__| |__||_______||___| |_|  |__||_______|  |_______||___|  |_||___| |______| |_______||_______|  |_|   |_||_______|  |___|  |__| |__||_______||______| |_______|

     */
    var _nonMsgBridgeMethods = {
        ver1: [
            /**
             * Platform Bridge Version 1 Call this function to allow the back Press.
             * @method allowBackPress
             * @memberOf platformSdk.bridge
             * @param {string} allowBack
             */
            'allowBackPress',

            /**
             * Platform Bridge Version 1 calling this method will forcefully block the full screen bot.
             * @method blockChatThread
             * @memberOf platformSdk.bridge
             * @param {string} isBlocked
             */
            'blockChatThread',

            /**
             * Platform Bridge Version 1 call this function to delete the entire notif data of the microApp.
             * @method deleteAllNotifData
             * @memberOf platformSdk.bridge
             */
            'deleteAllNotifData',

            /**
             * Platform Bridge Version 1 Call this function to delete partial notif data pertaining to a microApp.
             * @method deletePartialNotifData
             * @memberOf platformSdk.bridge
             */
            'deletePartialNotifData',

            /**
             * Platform Bridge Version 1 Utility method to call finish of the current activity
             * @method finish
             * @memberOf platformSdk.bridge
             */
            'finish',

            /**
             * Platform Bridge Version 1 Calling this function will initiate forward of the message to a friend or group.
             * @method forwardToChat
             * @param {string} json Stringified json
             * @param {string} hikeMessage
             * @memberOf platformSdk.bridge
             */
            'forwardToChat',

            /**
             * Platform Bridge Version 1 calling this method will forcefully mute the full screen bot.
             * @method muteChatThread
             * @memberOf platformSdk.bridge
             */
            'muteChatThread',

            /**
             * Platform Bridge Version 1 Call this method to put data in cache.
             * @method putInCache
             * @param {string} key
             * @param {string} value
             * @memberOf platformSdk.bridge
             */
            'putInCache',

            /**
             * Platform Bridge Version 1 Call this method to put bulk data in cache.
             * @method putLargeDataInCache
             * @param {string} json Stringified json
             * @memberOf platformSdk.bridge
             */
            'putLargeDataInCache',

            /**
             * Platform Bridge Version 1 Utility method to remove a menu from the list of menu options for a bot
             * @method removeMenu
             * @param {string} id
             * @memberOf platformSdk.bridge
             */
            'removeMenu',

            /**
             * Platform Bridge Version 1 Utility method to fetch the overflowMenu from the MicroApp.
             * @method replaceOverflowMenu
             * @param {string} newMenuString Stringified menu item object
             * @memberOf platformSdk.bridge
             */
            'replaceOverflowMenu',

            /**
             * Platform Bridge Version 1 this function will update the helper data.
             * @method updateHelperData
             * @param {string} json Stringified helper data object
             * @memberOf platformSdk.bridge
             */
            'updateHelperData',

            /**
             * Platform Bridge Version 1 Call this function to update the overflow menu items.
             * @method updateOverflowMenu
             * @param {string} itemId
             * @param {string} itemJson Stringified menu item json
             * @memberOf platformSdk.bridge
             */
            'updateOverflowMenu'
        ],

        ver2: [
            /**
             * Platform Version 2 called by the special packet sent in the bot to delete the conversation of the particular bot
             * @method deleteBotConversation
             * @memberOf platformSdk.bridge
             */
            'deleteBotConversation',

            /**
             * Platform bridge Version 2 Call this function to open a full page webView within hike.
             * @method openFullPage
             * @param {string} title
             * @param {string} url
             * @memberOf platformSdk.bridge
             */
            'openFullPage'
        ],

        ver3: [
            /**
             * Platform Version 3 call this method to change the title of the action bar for the bot.
             * @method changeBotTitle
             * @param {string} title New title
             * @memberOf platformSdk.bridge
             */
            'changeBotTitle',

            /**
             * Platform Bridge Version 3 call this function to delete the entire caching related to the namespace of the bot.
             * @method deleteAllCacheData
             * @memberOf platformSdk.bridge
             */
            'deleteAllCacheData',

            /**
             * Platform Bridge Version 3 Call this function to delete partial cached data pertaining to the namespace of the bot, The key is provided by Javascript
             * @method deletePartialCacheData
             * @param {string} key
             * @memberOf platformSdk.bridge
             */
            'deletePartialCacheData',

            /**
             * Platform Version 3 call this method to reset the title of the action bar for the bot to the original title sent by server.
             * @method resetBotTitle
             * @memberOf platformSdk.bridge
             */
            'resetBotTitle'
        ],

        ver4: [
            /**
             * Platform bridge Version 4 Call this method to change the status bar color at runtime.
             * @method setStatusBarColor
             * @param {string} sbColor Status bar color in argb
             * @memberOf platformSdk.bridge
             */
            'setStatusBarColor'
        ],

        ver5: [
            /**
             * Platform Bridge Version 5 Call this function to allow the up Press.
             * @method allowUpPress
             * @param {string} toAllow
             * @memberOf platformSdk.bridge
             */
            'allowUpPress',

            /**
             * Platform Bridge Version 5 Call this function to change action bar color at runtime.
             * @method setActionBarColor
             * @param {string} abColor Action bar color in argb
             * @memberOf platformSdk.bridge
             */
            'setActionBarColor'
        ],

        ver6: [
            /**
             * Platform Version 6 This function is made for the special Shared bot that has the information about some other bots as well, and acts as a channel for them.
             * @method blockBot
             * @param {string} block
             * @param {string} msisdn
             * @memberOf platformSdk.bridge
             */
            'blockBot',

            /**
             * Platform Version 6 Call this function to delete all the events, be it shared data or normal event pertaining to a single message.
             * @method deleteAllEventsForMessage
             * @param {string} messageHash
             * @memberOf platformSdk.bridge
             */
            'deleteAllEventsForMessage',

            /**
             * Platform Version 6 Call this function to delete an event from the list of events that are shared with the microapp.
             * @method deleteEvent
             * @param {string} eventId
             * @memberOf platformSdk.bridge
             */
            'deleteEvent',

            /**
             * Platform Bridge Version 6 Call this method to post a status update to timeline.
             * @method postStatusUpdate
             * @param {string} status
             * @param {string} moodId
             * @param {string} [imageFilePath]
             * @memberOf platformSdk.bridge
             */
            'postStatusUpdate',

            /**
             * Platform version 6 Call this method to send a normal event.
             * @method sendNormalEvent
             * @param {string} messageHash
             * @param {string} eventData
             * @memberOf platformSdk.bridge
             */
            'sendNormalEvent',

            /**
             * Platform Version 6 Call this function to send a shared message to the contacts of the user.
             * @method sendSharedMessage
             * @param {string} cardObject Stringified card object
             * @param {string} hikeMessage
             * @param {string} sharedData Stringified json
             * @memberOf platformSdk.bridge
             */
            'sendSharedMessage' // Platform Version 6 Call this function to send a shared message to the contacts of the user.
        ]
    };

    /**
     * Initiates android bridge.
     * @param platformVersion
     * @param appType
     * @param appMessageId
     * @returns {Object}
     */
    window.initiateBridge = function (platformVersion, appType, appMessageId) {
        var _bridge, bridgeMethods, counter;

        /**
         * Methods to interact with the Android Bridge.
         *
         * @namespace platformSdk.bridge
         * @memberOf platformSdk
         */
        _bridge = {};

        messageId = appMessageId;

        bridgeMethods = appType === 'NM' ? _nonMsgBridgeMethods : _msgBridgeMethods;

        for (counter = 0; counter <= parseInt(platformVersion); counter++) {
            var versionKey = 'ver' + counter,
                baseMethodList = _commonBridgeMethods[versionKey],
                bridgeMethodList = bridgeMethods[versionKey];

            baseMethodList && _createWrappers(_bridge, baseMethodList);
            bridgeMethodList && _createWrappers(_bridge, bridgeMethodList);
        }

        return _bridge;
    };

})(window);

/**
 * @namespace platformSdk
 */

window.platformSdk = function (window, undefined) {
    "use strict";

    //classlist hack for android 2.3 and below
    if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== "undefined") {
        Object.defineProperty(HTMLElement.prototype, "classList", {
            get: function () {
                function t (t) {
                    return function (n) {
                        var r = e.className.split(/\s+/),
                            i = r.indexOf(n);
                        t(r, i, n);
                        e.className = r.join(" ");
                    };
                }

                var e = this;
                var n = {
                    add: t(function (e, t, n) {
                        ~t || e.push(n);
                    }),
                    remove: t(function (e, t) {
                        ~t && e.splice(t, 1);
                    }),
                    toggle: t(function (e, t, n) {
                        ~t ? e.splice(t, 1) : e.push(n);
                    }),
                    contains: function (t) {
                        return !!~e.className.split(/\s+/).indexOf(t);
                    },
                    item: function (t) {
                        return e.className.split(/\s+/)[t] || null;
                    }
                };
                Object.defineProperty(n, "length", {
                    get: function () {
                        return e.className.split(/\s+/).length;
                    }
                });
                return n;
            }
        });
    }

    var platformVersion = parseInt(document.getElementsByTagName('body')[0].getAttribute("data-platform-version")) || 0;
    var appType = document.getElementsByTagName('body')[0].getAttribute("data-app-type") || 'M';
    var messageId = document.getElementsByTagName('body')[0].getAttribute('data-message-id');

    var platformBridge = window.initiateBridge(platformVersion, appType);

    var fireAppInit = function () {
        var cardHeight = document.body.offsetHeight;
        if (platformBridge) platformSdk.ui.onLoadFinished(cardHeight + "");

        if ('M' === appType) {
            setTimeout(function () {
                cardHeight = document.body.offsetHeight;

                if (Math.abs(window.innerHeight - cardHeight) > 5 && platformBridge) {
                    platformSdk.ui.resize(cardHeight);
                    platformSdk.events.publish('onnativeready');
                }
            }, 100);
        }
    };

    window.onload = fireAppInit;

    /**
     * Called by the android to pass on the initial data to micro app
     * @function
     * @global
     * @param {String} msisdn - msisdn of micro app.
     * @param {Object} helperData - helper data for the micro app.
     * @param {Boolean} isSent - isSent
     * @param {String} uid - uid
     * @param {String} appVersion - app version
     */
    var setData = function (msisdn, helperData, isSent, uid, appVersion) {

        var appData = {
            msisdn: msisdn,
            isSent: isSent,
            uid: uid,
            appVersion: appVersion
        };

        appData.helperData = JSON.parse(helperData);
        setAppData(appData);
    };

    var appInitialized = false;


    /**
     * Called by the android to pass on the initial data to micro app
     * @function
     * @global
     * @param {Object} appData - application data passed to the micro app on startup
     */
    var setAppData = function (appData) {

        if (appInitialized) return;
        else appInitialized = true;

        if (typeof appData === 'string') {
            appData = decodeURIComponent(appData);
            appData = JSON.parse(appData);
        }

        if (appData.hd) {
            appData.helperData = JSON.parse(appData.hd);
            delete appData.hd;
        }

        if (appData.msisdn) {

            platformSdk.appData = appData;

            /*for (var key in appData) {
             platformSdk[key] = appData[key];
             }*/

            if (appData.helperData) {
                if (appData.helperData.debug) {
                    platformSdk.debugMode = true;
                    platformSdk.logger.logLoadTimeInfo();
                    platformBridge.setDebuggableEnabled(true);
                }
            } else platformSdk.appData.helperData = {};
        }

        platformSdk.events.publish('webview/data/loaded');

        if (platformSdk.appData.helperData.cardExpireTime) {
            PlatformBridge.setAlarm('{"alarm_data": {"isAlarmSet": 0},  "conv_msisdn" :"' + platformSdk.msisdn + '", "inc_unread": "0", "delete_card": true}', platformSdk.helperData.cardExpireTime.toString());
        }
    };

    window.setData = setData;

    /**
     * Called by the android to pass on the initial data to micro app
     * @function
     * @global
     */
    window.onResume = function () {
        platformSdk.events.publish('app/onresume');
    };

    /**
     * Called by the android on exit from the micro app.
     * @function
     * @global
     * @fire 'app/onbeforeunload'
     */
    window.onPause = function () {
        platformSdk.events.publish('app/onbeforeunload');
    };

    window.init = setAppData;

    return {
        /**
         * @memberOf platformSdk
         * @inner
         * @type {String}
         */
        VERSION: '0.0.1',

        /**
         * @memberOf platformSdk
         * @inner
         * @type {String}
         */
        card: '',

        /**
         * @memberOf platformSdk
         * @inner
         * @type {String}
         */
        msisdn: null,

        /**
         * @memberOf platformSdk
         * @inner
         * @type {Boolean}
         */
        bridgeEnabled: true, // ToDo: This should be dynamically set

        /**
         * @memberOf platformSdk
         * @inner
         * @type {String}
         */
        platformVersion: platformVersion,

        /**
         * @memberOf platformSdk
         * @inner
         * @type {String}
         */
        appType: appType,

        /**
         * @memberOf platformSdk
         * @inner
         * @type {String}
         */
        messageId: messageId,

        /**
         * @memberOf platformSdk
         * @inner
         * @type {Object}
         */
        bridge: platformBridge,


        /**
         * Specify a function to execute when the micro-app and android bridge are fully loaded.
         * @function
         * @memberOf platformSdk
         * @inner
         * @param {function} fn - function to be called once the 'webview/data/loaded' event has been fired
         */
        ready: function (fn) {
            var that = this;
            var start = platformSdk.events.subscribe('webview/data/loaded', function () {
                that.bridgeEnabled = that.checkBridge();
                if (typeof fn === "function") fn();
                start.remove();
            });
        },

        /**
         * checks if android bridge is available or not
         * @function
         * @memberOf platformSdk
         * @inner
         * @param {function} fn - function to be called once the 'webview/data/loaded' event has been fired
         * @return {Boolean} 'true' if bridge available, 'false' otherwise
         */
        checkBridge: function () {
            return typeof PlatformBridge === "undefined" ? false : true;
        },

        /**
         * Blocks the current chat thread. The user won't see any messages in the chat thread afterwards.
         * @function
         * @memberOf platformSdk
         * @inner
         */
        blockChatThread: function () {
            platformBridge.blockChatThread("true");
        },

        /**
         * Un-blocks the current chat thread.
         * @function
         * @memberOf platformSdk
         * @inner
         */
        unblockChatThread: function () {
            platformBridge.blockChatThread("false");
        },

        /**
         * Deletes the current message.
         * @function
         * @memberOf platformSdk
         * @inner
         */
        deleteMessage: function () {
            platformBridge.deleteMessage();
        },


        /**
         * Updates the metadata of the app.
         * @function
         * @memberOf platformSdk
         * @inner
         * @param {Object} data - new metaData object
         * @param {boolean} notifyScreen - if true, the adapter will be notified of the change, else there will be only db update.
         */
        updateMetadata: function (data, notifyScreen) {
            platformBridge.updateMetadata(platformSdk.utils.validateStringifyJson(data), notifyScreen);
        },


        /**
         * Opens the given link in a full screen webview.
         * @function
         * @memberOf platformSdk
         * @inner
         * @param {String} title - title of the new page.
         * @param {String} href - url of the web page to be opened in full screen.
         */
        openFullPage: function (title, href) {
            platformBridge.openFullPage(title, href);
        },


        /**
         * Mutes the current chat thread. The user won't receive any more notifications there after.
         * @function
         * @memberOf platformSdk
         * @inner
         */
        muteChatThread: function () {
            platformBridge.muteChatThread();
        },

        /**
         * Deletes any alarm set by the micro app
         * @function
         * @memberOf platformSdk
         * @inner
         */
        deleteAlarm: function () {
            platformBridge.deleteAlarm();
        },

        /**
         * Updates the helper data of the micro app.
         * @function
         * @memberOf platformSdk
         * @inner
         * @param {Object} data - new helper data object
         */
        updateHelperData: function (data) {
            platformBridge.updateHelperData(platformSdk.utils.validateStringifyJson(data));
        },

        /**
         * puts large data in the cache for the microapp.
         * @function
         * @memberOf platformSdk
         * @inner
         * @param {Object} data - data object to be put into cache
         */
        setBlob: function (data) {
            var str = platformSdk.utils.validateStringifyJson(data);
            platformBridge.putLargeDataInCache(str);
        },

        /**
         * sets an alarm for the micro app for the given time.
         * @function
         * @memberOf platformSdk
         * @inner
         * @param {Object} alarmData - data to pass for setting alarm
         * @param {Object} nextPollIt - time in milli seconds.
         */
        setAlarm: function (alarmData, nextPollIt) {
            if (typeof alarmData !== 'string')
                alarmData = platformSdk.utils.validateStringifyJson(alarmData);

            platformBridge.setAlarm(alarmData, nextPollIt);
        },

        /**
         * Gets the latest data received by the app through notifications.
         * @function
         * @memberOf platformSdk
         * @inner
         * @return {Object} latest notification data object
         */
        getLatestNotifData: function () {
            var notifData = platformSdk.appData.notifData;

            var arr = [];
            for (var key in notifData) {
                arr.push(key);
            }

            arr.sort(function (a, b) {
                return b - a;
            });
            return notifData[arr[0]];
        }
    };
}(window);

/**
 * General utility function.
 * @namespace platformSdk.utils
 * @memberOf platformSdk
 */
platformSdk.utils = function (window, platformSdk) {

    var platformBridge = platformSdk.bridge;

    (function () {
        var cache = {};
        this.tmpl = function tmpl (str, data) {
            var fn = !/\W/.test(str) ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');");
            return data ? fn(data) : fn;
        };
    })();

    return {
        /**
         * Logs the given message and caption
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {String} msg - message string to be logged
         * @param {String} caption - caption for the log
         */
        log: function (msg, caption) {
            if (platformSdk.bridgeEnabled) platformBridge.logFromJS("platform-js-sdk", msg);
            if (console) {
                if (caption)
                    console.log(caption + ":");
                console.log(msg);
            }
        },

        debug: function (object) {
            if (platformSdk.bridgeEnabled) platformBridge.logFromJS("platform-js-sdk", this.validateStringifyJson(object));
        },

        /**
         * Logs the analytics to the analytics server
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Boolean} isUI - whether the event is a UI event or not
         * @param {String} type - the subtype of the event to be logged, eg. send "click", to determine whether it is a click event.
         * @param {Object} analyticEvents  - the analytics event object
         */
        logAnalytics: function (isUI, type, analyticEvents) {
            analyticEvents = this.validateStringifyJson(analyticEvents);
            this.log("analytic with isui = " + isUI + " type = " + type + " analyticEvents = " + analyticEvents);
            if (platformSdk.bridgeEnabled) PlatformBridge.logAnalytics(isUI, type, analyticEvents);
        },

        /**
         * Validates and stringify a passed json Object
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Object} josn - json object to be validated and strigified
         * @return {String} stringified json
         */
        validateStringifyJson: function (json) {
            //HACK to handle the helperdata bug. we cannot have \" or ' in the str.
            var jsonString = JSON.stringify(json);
            jsonString = jsonString.replace(/\\"/g, "&quot;");
            jsonString = jsonString.replace(/'/g, "&#39;");
            jsonString = jsonString.replace(/\\n/g, " ");
            return jsonString;
        },

        /**
         * Merges 2 arrays while removing the duplicate enteries.
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Array} array1 - first array
         * @param {Array} array2 - second array to be merged
         * @return {Array} merged array
         */
        merge: function (array1, array2) {
            var array = array1.concat(array2);
            for (var i = 0; i < array.length; i++) {
                for (var j = i + 1; j < array.length; j++) {
                    if (array[i] === array[j])
                        array.splice(j--, 1);
                }
            }
            return array;
        },

        /**
         * Sort an array with the given key
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Array} array - Array to be sorted
         * @param {String} key - key to sort the array with
         * @param {String} type - type of sorting, 'asc' for ascending and 'desc' for descending
         */
        sort: function (array, key, type) {
            type = type || 'asc';
            return array.sort(function (a, b) {
                var x = a[key];
                var y = b[key];
                if (type === "asc") return ((x < y) ? -1 : ((x > y) ? 1 : 0));
                else return ((x > y) ? -1 : ((x < y) ? 1 : 0));
            });
        },

        /**
         * Determines if object is empty(has no properties of his own)
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Object} obj - Object to be checked for emptiness
         * @return {Boolean} true if object is empty, false otherwise.
         */
        isEmpty: function (obj) {
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        /**
         * Adds a given function as an event listener for a list of node elements
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Array} list - list of node elemnets
         * @param {String} event - event name
         * @param {Function} fn - listener function
         */
        addEventListenerList: function (list, event, fn) {
            for (var i = 0, len = list.length; i < len; i++) {
                list[i].addEventListener(event, fn, false);
            }
        },

        /**
         * Removes a given function as an event listener for a list of node elements
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Array} list - list of node elemnets
         * @param {String} event - event name
         * @param {Function} fn - listener function to be removed
         */
        removeEventListenerList: function (list, event, fn) {
            for (var i = 0, len = list.length; i < len; i++) {
                list[i].removeEventListener(event, fn, false);
            }
        },

        /**
         * returns a list of all siblings of the given element
         * @param  {nodeElement} ele - element whose siblings are required
         * @return {Array} list of siblings
         */
        siblings: function (ele) {
            function getChildren (ele, skipMe) {
                var r = [];
                var elem = null;
                for (; ele; ele = ele.nextSibling)
                    if (ele.nodeType == 1 && ele != skipMe)
                        r.push(ele);
                return r;
            }

            return getChildren(ele.parentNode.firstChild, ele);
        },

        /**
         * Scrolls down a given element to the given Y position
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {HtmlNode} elem - element to scroll
         * @param {Number} Y - position to scroll to
         * @param {Number} duration - scroll duration in milliseconds
         * @param {Function} easingFunction - easing function to scroll with
         * @param {Function} callback - callback once the scroll is complete
         */
        scrollTo: function (elem, Y, duration, easingFunction, callback) {

            if (typeof elem == "undefined")
                elem = document.documentElement.scrollTop ? document.documentElement : document.body;
            var start = Date.now();
            var from = elem.scrollTop;

            if (from === Y) {
                if (callback) callback();
                return;
                /* Prevent scrolling to the Y point if already there */
            }

            function min (a, b) {
                return a < b ? a : b;
            }

            function scroll () {

                var currentTime = Date.now(),
                    time = min(1, ((currentTime - start) / duration)),
                    easedT = easingFunction(time);

                elem.scrollTop = (easedT * (Y - from)) + from;

                if (time < 1) requestAnimationFrame(scroll);
                else if (callback) callback();
            }

            requestAnimationFrame(scroll);
        },

        /**
         * common easing function, each of them require time duration as input
         * @namespace
         * @memberOf platformSdk.utils
         * @inner
         * @property {Function} linear - no easing, no acceleration
         * @property {Function} easeInQuad - accelerating from zero velocity
         * @property {Function} easeOutQuad - decelerating to zero velocity
         * @property {Function} easeInOutQuad - acceleration until halfway, then deceleration
         * @property {Function} easeInCubic - accelerating from zero velocity
         * @property {Function} easeOutCubic - decelerating to zero velocity
         * @property {Function} easeInOutCubic - acceleration until halfway, then deceleration
         * @property {Function} easeInQuart - accelerating from zero velocity
         * @property {Function} easeOutQuart - decelerating to zero velocity
         * @property {Function} easeInOutQuart - acceleration until halfway, then deceleration
         * @property {Function} easeInQuint - accelerating from zero velocity
         * @property {Function} easeOutQuint - decelerating to zero velocity
         * @property {Function} easeInOutQuint - acceleration until halfway, then deceleration
         */
        easing: {
            // no easing, no acceleration
            linear: function (t) {
                return t;
            },

            // accelerating from zero velocity
            easeInQuad: function (t) {
                return t * t;
            },

            // decelerating to zero velocity
            easeOutQuad: function (t) {
                return t * (2 - t);
            },

            // acceleration until halfway, then deceleration
            easeInOutQuad: function (t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            },

            // accelerating from zero velocity
            easeInCubic: function (t) {
                return t * t * t;
            },

            // decelerating to zero velocity
            easeOutCubic: function (t) {
                return (--t) * t * t + 1;
            },

            // acceleration until halfway, then deceleration
            easeInOutCubic: function (t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            },

            // accelerating from zero velocity
            easeInQuart: function (t) {
                return t * t * t * t;
            },

            // decelerating to zero velocity
            easeOutQuart: function (t) {
                return 1 - (--t) * t * t * t;
            },

            // acceleration until halfway, then deceleration
            easeInOutQuart: function (t) {
                return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
            },

            // accelerating from zero velocity
            easeInQuint: function (t) {
                return t * t * t * t * t;
            },

            // decelerating to zero velocity
            easeOutQuint: function (t) {
                return 1 + (--t) * t * t * t * t;
            },

            // acceleration until halfway, then deceleration
            easeInOutQuint: function (t) {
                return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
            }
        },

        /**
         * get the height of a dom element
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {NodeElement} el - dom element
         * @return {Number} height of the given element
         */
        getHeight: function (el) {
            var children = el.children;
            var len = children.length;
            var height = 0;

            for (var i = 0; i < len; i++) {
                height = height + parseInt(children[i].offsetHeight);
            }
            return height;
        },

        /**
         * Find the closest elemnt of a given dom element
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {NodeElement} el - Dom element to find closest of
         * @param {String} tag - elemnt to search for closest to el
         * @return {NodeElement} closest element
         */
        closest: function (el, tag) {
            tag = tag.toUpperCase();
            do {
                if (el.nodeName === tag) return el;
            } while (el = el.parentNode);

            return null;
        },

        /**
         * The debounce function will not allow a callback to be used more than once per given time frame.
         * @function
         * @memberOf platformSdk.utils
         * @inner
         * @param {Function} func - the callback function
         * @param {Number} wait - wait time in milliseconds
         * @param {Boolean} immediate - if true callback will be executed on the leading edge instead of trailing edge
         * @return {Function} Returns a function, that, as long as it continues to be invoked, will not be triggered. The function will be called after it stops being called for 'wait' milliseconds. If `immediate` is passed, the callback function will be triggered on the leading edge, instead of the trailing.
         */
        debounce: function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this,
                    args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    };

}(window, window.platformSdk);


/**
 * @namespace platformSdk.events
 * @memberOf platformSdk
 */
platformSdk.events = function (window, platformSdk) {
    var events = {};
    var hOP = events.hasOwnProperty;
    var platformBridge = platformSdk.bridge;

    return {
        /**
         * Subscribe to an event and attach a listener function to be called whenever that event is published
         * @function
         * @memberOf platformSdk.events
         * @param {String} eventName - name of the event you wish to subscribe to
         * @param {Function} listener - function to be executed each time the event is published
         * @return {Object} an object with a remove function to remove the event subscription
         */
        subscribe: function (eventName, listener) {
            if (!hOP.call(events, eventName)) events[eventName] = [];
            var index = events[eventName].push(listener) - 1;
            return {
                remove: function () {
                    delete events[eventName][index];
                }
            };
        },


        /**
         * Publish an event.
         * @function
         * @memberOf platformSdk.events
         * @param {String} eventName - name of the event you wish to publish
         * @param {Object} data - data to be passed to the listener function
         */
        publish: function (eventName, data) {
            if (!hOP.call(events, eventName))
                return;
            events[eventName].forEach(function (item) {
                item(data != undefined ? data : {});
            });
        }
    };

}(window, window.platformSdk);

(function (window, platformSdk) {
    var callbacks = {};
    var eventsObject = {};

    function getNewId () {
        var cbId = Math.round(Math.random() * 999999999);
        while (cbId in callbacks) {
            cbId = Math.round(Math.random() * 999999999);
        }
        return cbId;
    }

    /**
     * Called by the android to return the response for the action asked by the microapp through platformSdk.nativeReq function.
     * @function
     * @global
     * @param {String} id - unique id to map the response to the action.
     * @param {Object} data - data in response from the android.
     */
    window.callbackFromNative = function (id, data) {

        var args, cbItem = callbacks[id];
        if (cbItem && typeof(cbItem.callback) === 'function') {
            cbItem.callback.call(cbItem.context, data);
        }

        delete callbacks[id];
    };

    /**
     * calling an action from android and accepting a success callback to be called with data from android in response
     * @function
     * @memberOf platformSdk
     * @inner
     * @param {Object} param - object containing the configuration for communication with android
     */
    platformSdk.nativeReq = function (param) {

        var callBackId = "" + getNewId();

        callbacks[callBackId] = {
            context: param.ctx,
            callback: param.success
        };

        if (platformSdk.bridgeEnabled) {
            if (param.data === "" || param.data === undefined || param.data === null) PlatformBridge[param.fn](callBackId);
            else PlatformBridge[param.fn](callBackId, param.data);
        }
    };

    /**
     * Setting up 3-dot menu options and setting up callbacks for each of them
     * @function
     * @memberOf platformSdk
     * @inner
     * @param {Object} omList - object containing the 3-dot menu options.
     */
    platformSdk.setOverflowMenu = function (omList) {
        for (var i = 0; i < omList.length; i++) {
            var omItem = omList[i];
            var eventId = getNewId();
            callbacks[eventId] = omItem;
            omItem.id = eventId;
        }

        omListObject = omList;

        if (platformSdk.bridgeEnabled) PlatformBridge.replaceOverflowMenu(platformSdk.utils.validateStringifyJson(omList));
    };


    /**
     * Called from android on click of 3-dot menu items
     * @function
     * @memberOf platformSdk
     * @inner
     * @param {String} id - id of the clicked menu item
     */
    platformSdk.onMenuItemClicked = function (id) {
        platformSdk.events.publish(callbacks[id].eventName, id);
    };

    /**
     * updating the 3-dot menu options and setting up callbacks for each of them
     * @function
     * @memberOf platformSdk
     * @inner
     * @param {Object} omList - object containing the 3-dot menu options.
     */
    platformSdk.updateOverflowMenu = function (id, c) {
        var obj = callbacks[id];
        for (var key in c) {
            obj[key] = c[key];
        }

        console.log('updateOverflowMenu object: ', id, obj);
        if (platformSdk.bridgeEnabled) PlatformBridge.updateOverflowMenu(id, platformSdk.utils.validateStringifyJson(obj));
    };

    /**
     * Get the id of the 3-dot menu item by their event name
     * @function
     * @memberOf platformSdk
     * @inner
     * @param {String} eventName - event name of the required 3-dot menu item
     * @return {String} id of the required 3-dot menu item
     */
    platformSdk.retrieveId = function (eventName) {
        for (var i = 0; i < omListObject.length; i++) {
            var omItem = omListObject[i];
            if (omItem.eventName === eventName) return omItem.id;
        }
    };

})(window, window.platformSdk);

platformSdk.device = function (window, platformSdk) {

    "use strict";

    var platformBridge = platformSdk.bridge;

    return {};

}(window, window.platformSdk);

platformSdk.network = function (window, platformSdk) {

    "use strict";

    var platformBridge = platformSdk.bridge;

    return {};

}(window, window.platformSdk);

platformSdk.user = function (window, platformSdk) {

    "use strict";
    var platformBridge = platformSdk.bridge;

    return {};

}(window, window.platformSdk);

/**
 * Microapp UI functions
 * @namespace platformSdk.ui
 * @memberOf platformSdk
 */
platformSdk.ui = function (window, platformSdk) {

    var platformBridge = platformSdk.bridge;

    var shareMessage;
    var captionText;

    platformSdk.events.subscribe('refresh/startAnimation/', function (ele) {
        ele.classList.add('play');
    });

    platformSdk.events.subscribe('refresh/stopAnimation/', function (ele) {
        ele.classList.remove('play');
    });

    if (!platformSdk.checkBridge) return false;
    return {

        /**
         * Communicate the Android about windows onload being finished, so that webview can be resized if required.
         * @function
         * @memberOf platformSdk.ui
         * @inner
         * @param {String} height - offsetHeight of the document.body
         */
        onLoadFinished: function (height) {
            platformBridge.onLoadFinished(height + "");
        },

        /**
         * Resize webview to a new height
         * @function
         * @memberOf platformSdk.ui
         * @inner
         * @param {String} height - height to be resized to
         */
        resize: function (height) {
            height = height || document.body.offsetHeight;
            platformBridge.onResize(height + "");
        },

        /**
         * Shows toast message to the user
         * @function
         * @memberOf platformSdk.ui
         * @inner
         * @param {String} msg - message to be shown in toast
         */
        showToast: function (msg) {
            platformBridge.showToast(msg);
        },


        /**
         * Share the current card to other users
         * @function
         * @memberOf platformSdk.ui
         * @inner
         * @param {Object} e - click event of the share button/link
         */
        shareCard: function (e) {
            e.preventDefault();
            e.stopPropagation();

            platformSdk.utils.log("share calling");

            if (platformSdk.appData.helperData != null && platformSdk.appData.helperData.share_text) {
                shareMessage = platformSdk.appData.helperData.share_text;
            } else {
                //shareMessage = "World Cup 2015 Live scores only on hike!";
                shareMessage = "hike up your life only on hike!";
            }
            if (platformSdk.appData.helperData != null && platformSdk.appData.helperData.caption_text) {
                captionText = platformSdk.appData.helperData.caption_text;
            } else {
                captionText = "";
            }

            platformBridge.share(shareMessage, captionText);
            platformSdk.utils.log("share called");

            return false;
        },

        /**
         * Forwards the current card to other users
         * @function
         * @memberOf platformSdk.ui
         * @inner
         * @param {Object} e - click event of the share button/link
         */
        forwardCard: function (e) {
            e.preventDefault();
            e.stopPropagation();
            //addRippleEffect(e);

            platformSdk.utils.log("forward calling");
            platformBridge.forwardToChat(platformSdk.forwardCardData);
            platformSdk.utils.log("forward callied  with json=" + platformSdk.forwardCardData);

            return false;
        }
    };
}(window, window.platformSdk);


/**
 * creates XMLHttpRequest object, set up the event listeners and makes httpRequest as per the given options
 * @function
 * @memberOf platformSdk
 * @inner
 * @param {Object} options - an object with properties required to make an ajax call.
 */
platformSdk.ajax = function (window, platformSdk) {

    var platformBridge = platformSdk.bridge;

    /**
     * function to handle success of ajax request
     * @param  {Object} xhr - XMLHttpRequest Object
     * @param  {Function} callback - callback function to be called on success
     */
    var ajaxSuccess = function (xhr, callback) {
        if (callback && typeof callback === 'function')
            callback(xhr.responseText, xhr.status);
    };


    /**
     * function to handle error of ajax request
     * @param  {Object} xhr - XMLHttpRequest Object
     * @param  {Function} callback - callback function to be called on error
     * @return {String} errorMsg - error message to be shown as toast in case of ajax error
     */
    var ajaxError = function (xhr, callback, errorMsg) {
        if (callback && typeof callback === 'function')
            callback(xhr.responseText, xhr.status);
        if (errorMsg)
            platformBridge.showToast(errorMsg);
    };

    /**
     * function to check internet connection
     * @param  {Function} fn - function to be called if user is connected to internet
     */
    var checkConnection = function (fn) {
        platformSdk.nativeReq({
            fn: 'checkConnection',
            ctx: this,
            data: "",
            success: function (response) {
                if (response != "-1" && response != "0") {
                    if (typeof fn === "function")
                        fn();
                } else
                    platformSdk.events.publish('app/offline');
            }
        });
    };

    /**
     * takes the options object for the ajax call, creates XMLHttpRequest object and set up the event listeners
     * @param  {Object} options - an object with properties required to make an ajax call
     */
    var fire = function (options) {
        var url = options.url,
            headers = options.headers,
            data = options.data,
            errorMsg = options.errorMessage,
            callbackSucess = options.success,
            callbackFailure = options.error,
            type = options.type.toUpperCase();

        var xhr = new XMLHttpRequest();

        platformSdk.utils.log("ajax call started on " + url);
        if (xhr) {

            /**
             * ready state change listener for the xhr object
             */
            xhr.onreadystatechange = function () {
                if (4 == xhr.readyState && 200 == xhr.status) {
                    if (platformSdk.debugMode)
                        platformSdk.logger.endMarker('xhrCall');
                    ajaxSuccess(xhr, callbackSucess);
                }
                if (4 == xhr.readyState && 200 != xhr.status) {
                    if (platformSdk.debugMode)
                        platformSdk.logger.endMarker('xhrCall');
                    ajaxError(xhr, callbackFailure, errorMsg);
                }
            };

            var datatype = Object.prototype.toString.call(data);
            if (datatype === '[object Object]')
                data = platformSdk.utils.validateStringifyJson(data);

            xhr.open(type, url, true);
            if (headers) {
                for (var i = 0; i < headers.length; i++) {
                    xhr.setRequestHeader(headers[i][0], headers[i][1]);
                }
            }

            if (platformSdk.debugMode)
                platformSdk.logger.setMarker('xhrCall');

            xhr.send(data);
        }
    }

    return function (options) {
        fire(options);
    };

}(window, window.platformSdk);

/**
 * @namespace platformSdk.logger
 * @memberOf platformSdk
 */
platformSdk.logger = function (window, platformSdk) {

    "use strict";

    var platformBridge = platformSdk.bridge;

    var markers = {};

    var latencyData = {
        html: {}
    };

    var drawDebugInfoOverlay = function (name, dataObj) {
        var debugInfoOverlay = document.getElementById("debug-info-overlay");

        if (debugInfoOverlay) {
            debugInfoOverlay.remove();
        }

        setTimeout(function () {
            var htmlStr = name;
            var body = document.body;
            var listStr = '<ul>';
            var link = document.getElementsByTagName('link');
            var basePath = link[0].getAttribute('href').split('assets')[0];
            var debugInfoOverlayDiv = document.createElement("div");
            var keyData;

            for (var key in dataObj) {
                listStr += '<li><b>' + key + '</b></li>';
                keyData = dataObj[key];

                for (var key in keyData) {
                    listStr += '<li>' + key + ' : ' + keyData[key] + '</li>';
                }
            }
            listStr += '</ul>';
            htmlStr = listStr + '<span class="icon-close tappingEffect" id="close-icon"><img width="14" src="' + basePath + 'assets/images/cross.png"></span>';

            debugInfoOverlayDiv.setAttribute('id', "debug-info-overlay");
            debugInfoOverlayDiv.innerHTML = htmlStr;

            body.appendChild(debugInfoOverlayDiv);

            var closeIcon = debugInfoOverlayDiv.getElementsByClassName('icon-close')[0];
            closeIcon.addEventListener('click', function () {
                debugInfoOverlayDiv.remove();
            });

        }, 15);
    };

    return {

        /**
         * Logs the load time data
         * @function
         * @memberOf platformSdk.logger
         * @inner
         */
        logLoadTimeInfo: function () {
            setTimeout(function () {
                var timingAPI;
                if (!platformSdk.debugMode)
                    return;

                if (window.performance) {
                    timingAPI = performance.timing;
                } else {
                    platformSdk.utils.log("timing API not supported by the webView");
                    return;
                }
                latencyData.html.networkLatency = timingAPI.responseEnd - timingAPI.fetchStart;
                latencyData.html.domReadiness = timingAPI.loadEventEnd - timingAPI.responseEnd;

                if (platformSdk.appData.time) {
                    latencyData.native = platformSdk.appData.time;
                }

                drawDebugInfoOverlay('DOM load', latencyData);

                platformSdk.utils.log(latencyData, 'latencyData');

            }, 100);
        },


        /**
         * Set a marker for navigation.performance api for performance measurements
         * @function
         * @memberOf platformSdk.logger
         * @inner
         * @param {String} name - name of the marker
         */
        setMarker: function (name) {
            if (window.performance)
                window.performance.mark(name + "_marker_start");
        },


        /**
         * End the marker set using setMarker function
         * @function
         * @memberOf platformSdk.logger
         * @inner
         * @param {String} name - name of the marker you wish to end
         * @param {Boolean} clearFlag - if true marker will be cleared
         */
        endMarker: function (name, clearFlag) {
            if (window.performance) {
                window.performance.mark(name + "_marker_end");
                this.measureMarker(name, clearFlag);
            }
        },

        /**
         * Logs the measurements of given marker
         * @function
         * @memberOf platformSdk.logger
         * @inner
         * @param {String} name - name of the marker you wish to measure
         * @param {Boolean} clearFlag - if true marker and its measurements will be cleared
         */
        measureMarker: function (name, clearFlag) {
            var measureName = name + '_measure';
            if (!window.performance) return;

            window.performance.measure(measureName, name + '_marker_start', name + '_marker_end');
            var measures = window.performance.getEntriesByName(name + '_measure');


            platformSdk.utils.log('name: ' + measures[0].name + ', duration: ' + measures[0].duration);

            if (clearFlag) {
                this.clearMarker(name);
                this.clearMeasure(name);
            }

            drawDebugInfoOverlay(name, measures[0]);
        },

        /**
         * Clear the marker set using setMarker function
         * @function
         * @memberOf platformSdk.logger
         * @inner
         * @param {String} name - name of the marker you wish to clear
         */
        clearMarker: function (name) {
            if (window.performance) {
                window.performance.clearMarks(name + "_marker_start");
                window.performance.clearMarks(name + "_marker_end");
            }
        },

        /**
         * Clear the measure
         * @function
         * @memberOf platformSdk.logger
         * @inner
         * @param {String} name - name of the marker you wish to clear
         */
        clearMeasure: function (name) {
            if (window.performance) {
                window.performance.clearMeasures(name + "_measure");
            }
        },


        /**
         * Clear all the markers
         * @function
         * @memberOf platformSdk.logger
         * @inner
         */
        clearAllMarker: function () {
            if (window.performance) {
                window.performance.clearMarks();
            }
        }
    };

}(window, window.platformSdk);

module.exports = platformSdk;