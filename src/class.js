(function(global) {
    var choc = global.choc = global.choc || {};

    var macros = {
        macros: ['Extend', 'Include'],

        process: function(klass, properties) {
            this.macros.forEach(function(macro) {
                if (!properties[macro]) return;

                var params = properties[macro];
                delete properties[macro];

                this[macro](klass, params);
            }, this);
        },

        Extend: function(klass, superClass) {
            try {
                superClass.__prototyping__ = true;
                klass.prototype = new superClass();
            } finally {
                delete superClass.__prototyping__;
            }
        },

        Include: function(klass, module) {
            if (Object.isArray(module)) {
                module.flatten().forEach(function(moduleToInclude) { this.Include(klass, moduleToInclude); }, this);
            }

            module = Object.isFunction(module) ? module.prototype : module;
            Object.merge(klass.prototype, module);
        }
    };

    var reset = function(object) {
        for (var key in object) {
            var value = object[key];
            if (Object.isObject(value) || Object.isArray(value)) {
                object[key] = Object.clone(value, true);
            }
        }
    };

    choc.Class = {
        create: function(properties) {
            var klass = function() {
                reset(this);
                if (klass.__prototyping__) return;
                if (this.initialize) return this.initialize.apply(this, arguments);
            };
            if (!properties) return klass;

            properties = Object.clone(properties);
            macros.process(klass, properties);
            Object.merge(klass.prototype, properties);

            return klass;
        },

        include: function(klass, module) {
            macros.Include(klass, module);
        }
    };
})(this);
