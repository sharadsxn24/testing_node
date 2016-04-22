/**
 * Created by anuraggrover on 10/08/15.
 */

(function () {
    'use strict';

    var AppHistory = function () {
        this.initialize();
    };

    AppHistory.prototype = {
        initialize: function () {
            this.reset();
        },

        getLength: function () {
            return this.states.length;
        },

        push: function ( state ) {
            return this.states.push( state );
        },

        pop: function () {
            var states = this.states,// ToDo: Stack
                stateObj;

            if (states.length === 1) {
                stateObj = {
                    current: states[states.length - 1]
                };
            } else {
                stateObj = {
                    current: states[states.length - 2],
                    prev: states[states.length - 1]
                };

                states.pop();
            }

            return stateObj;
        },

        reset: function () {
            this.states = [];
        }
    };

    module.exports = AppHistory;
})();