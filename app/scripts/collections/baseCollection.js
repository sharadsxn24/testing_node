/**
 * Created by anuraggrover on 27/07/15.
 */

(function () {
    'use strict';

    var utils = require('../util/utils'),
        couponService = require('../util/couponService'),
        cacheProvider = require('../util/cacheProvider'),
        BaseModel = require('../models/baseModel'),
        BaseCollection = function (models) {
            this.initialize(models);
        },

        addModels = function (models) {
            var that = this,
                _modelMap = that._modelMap,
                addedModels = [],
                len = that.models.length - 1;

            if (!models) {
                return;
            }

            that.parse(models);

            models.forEach(function (model, index) {
                _modelMap[model.id] = model instanceof BaseModel ? model : new that.model(model);
                _modelMap[model.id]['_index'] = index + len + 1;
                addedModels.push(_modelMap[model.id]);
            });

            that.models.push.apply(that.models, addedModels);
            // that.save();

            return addedModels;
        },

        noop = function () {
        };

    BaseCollection.prototype = {
        initialize: function (models) {
            var that = this;

            models = models || [];
            that.models = [];
            that._modelMap = {};

            if (!that.model) {
                that.model = BaseModel;
            }

            addModels.call(that, models);
        },

        fetch: noop,
        parse: noop, // This is called before models are created on the collection.

        fetchSuccess: function (models) {
            return addModels.call(this, models);
        },

        empty: function () {
            this.models = [];
        },

        get: function (modelId) {
            return this._modelMap[modelId];
        },

        set: function(modelId, model) {
            this.models[this._modelMap[modelId]._index] = model;
        },

        forEach: function (fn) {
            return this.models.forEach(fn);
        },

        toJSON: function () {
            return this.models.map(function (model) {
                return utils.simpleClone(model.attributes);
            });
        }
    };

    module.exports = BaseCollection;

})();