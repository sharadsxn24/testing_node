/**
 * Created by anuraggrover on 29/07/15.
 */

( function () {
    'use strict';

    var BaseModel,
        utils = require('../util/utils'),
        modelPrefix = 'model';

    BaseModel = function (attributes) {
        this.initialize(attributes);
    };

    BaseModel.prototype = {
        initialize: function ( attributes ) {
            var idAttribute;

            this.attributes = attributes = attributes || {};
            idAttribute = this.idAttribute || 'id';

            this.id = attributes[idAttribute] || utils.getUniqueId(modelPrefix);

            console.log(this);
        },

        get: function (key) {
            return this.attributes[key];
        },

        set: function (key, val) {
            this.attributes[key] = val;
            return this;
        }
    };

    module.exports = BaseModel;
} )();
