/**
 * Created by anuraggrover on 27/07/15.
 */

( function () {
    'use strict';

    var utils = require('../util/utils'),
        platformSdk = require('../../libs/js/platformSdk'),
        BaseView = function () {
            this.initialize();
        },
        noop = function () {};

    BaseView.prototype = {
        initialize: function ( options ) {
            var that = this;
            utils.extend(that, options);
            that.el = that.el || document.createElement( 'div' );
            that.eventList = [];
        },

        render: function () {
            return this;
        },

        listenTo: function (eventMap) {
            var that = this,
                eventName;

            for (eventName in eventMap) {
                if (eventMap.hasOwnProperty(eventName)) {
                    that.eventList.push(platformSdk.events.subscribe(eventName, eventMap[eventName]));
                }
            }
        },

        remove: function () {
            var that = this;

            that.eventList.forEach(function (obj) {
                obj.remove();
            });

            that.eventList = [];

            that.el.parentNode.removeChild(that.el);
        },
        addEventListeners: noop,
        onRender: noop
    };

    module.exports = BaseView;

} )();