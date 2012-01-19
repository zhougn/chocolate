(function(global) {
    var choc = global.choc = global.choc || {};

    var resetFields = function(object) {
        for (var key in object) {
            var value = object[key];
            if (Object.isObject(value) || Object.isArray(value)) {
                object[key] = Object.clone(value, true);
            }
        }
    };

    var klassMethods = {
        extend: function(properties) {
            var klass = createKlass();

            this.__prototyping__ = true;
            klass.prototype = new this();
            delete this.__prototyping__;

            return include(klass, properties);
        },

        include: function(properties) {
            return include(this, properties);
        }
    };

    var createKlass = function() {
        var klass = function() {
            resetFields(this);
            if (klass.__prototyping__) return;
            if (this.initialize) return this.initialize.apply(this, arguments);
        };
        Object.merge(klass, klassMethods);
        return klass;
    };

    var include = function(klass, module) {
        if (!module) return klass;

        if (Object.isArray(module)) {
            module.flatten().forEach(function(moduleToInclude) { include(klass, moduleToInclude); });
        }

        var properties = Object.isFunction(module) ? module.prototype : module;

        processMacros(klass, macroProperties(properties));
        Object.merge(klass.prototype, nonMacroProperties(properties));

        return klass;
    };

    var processMacros = function(klass, macros) {
        Object.each(macros, function(key, value) {
            macrosProcessers[key](klass, value);
        });
    };

    var nonMacroProperties = function(properties) {
        var result = {};
        for (var key in properties) {
            if (!macrosProcessers[key]) result[key] = properties[key];
        }
        return result;
    };

    var macroProperties = function(properties) {
        var result = {};
        for (var key in properties) {
            if (macrosProcessers[key]) result[key] = properties[key];
        }
        return result;
    };

    var macrosProcessers = {
        Include: include
    };

    choc.klass = function(properties) {
        return include(createKlass(), properties);
    };
})(this);
