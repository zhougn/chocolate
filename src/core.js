(function(global) {
    var choc = global.choc = global.choc || {};

    var macros = {
        macros: ['Include'],
        process: function(klass, properties) {
            this.macros.forEach(function(macro) {
                if (!properties[macro]) return;

                var params = properties[macro];
                delete properties[macro];

                this[macro](klass, params);
            }, this);
        },

        Include: function(klass, module) {
            if (Object.isArray(module)) {
                module.flatten().forEach(function(moduleToInclude) { this.Include(klass, moduleToInclude); }, this);
            }

            module = Object.isFunction(module) ? module.prototype : module;
            Object.merge(klass.prototype, module);
        }
    };

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

    var include = function(klass, properties) {
        if (!properties) return klass;

        properties = Object.clone(properties);
        macros.process(klass, properties);
        Object.merge(klass.prototype, properties);

        return klass;
    };

    choc.klass = function(properties) {
        return include(createKlass(), properties);
    };
})(this);
