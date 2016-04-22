/**
 * Created by anuraggrover on 27/07/15.
 */

( function () {
    'use strict';

    var utils = require( '../util/utils' ),
        Mustache = require( '../../libs/js/mustache'),
        BaseView = require( './baseView' ),
        configTemplate = require( 'raw!../../templates/config.html' );


    var ConfigPage = function () {
        this.initialize();
    };

    ConfigPage.prototype = {
        initialize: function () {
            var that = this;

            that.el = document.createElement('div');
            that.el.classList.add('cfg-page');
        },

        render: function () {
            var that = this;

            that.el.innerHTML = Mustache.render(configTemplate, {
                categories: [ {
                    title: 'Restaurants'
                }, {
                    title: 'Shopping'
                }, {
                    title: 'Online'
                } ]
            } );

            that.addEventListeners();

            return that;
        },

        addEventListeners: function () {
            var that = this;

            that.el.addEventListener( 'tap', function ( e ) {
                if ( e.target.classList.contains( 'c-c-selector' ) ) {
                    e.target.toggleClass('selected');
                }
            }, false );
        }
    };

    utils.extend( ConfigPage, BaseView );

    module.exports = ConfigPage;
} )();