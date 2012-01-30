(function(global) {
    var choc = global.choc = global.choc || {};

    function resetFields(object) {
        for (var key in object) {
            var value = object[key];
            if (Object.isObject(value) || Object.isArray(value)) {
                object[key] = Object.clone(value, true);
            }
        }
    }

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

    function createKlass() {
        var klass = function() {
            resetFields(this);
            if (klass.__prototyping__) return;
            if (this.initialize) return this.initialize.apply(this, arguments);
        };
        Object.merge(klass, klassMethods);
        return klass;
    }

    function include(klass, module) {
        if (!module) return klass;

        if (Object.isArray(module)) {
            module.flatten().forEach(function(moduleToInclude) { include(klass, moduleToInclude); });
        }

        var properties = Object.isFunction(module) ? module.prototype : module;

        macro.process(klass, properties, 'pre');
        Object.merge(klass.prototype, macro.excludeMacroProperties(properties));
        macro.process(klass, properties, 'post');

        return klass;
    }

    choc.klass = function(properties) {
        return include(createKlass(), properties);
    };

    var macro = choc.macro = {
        _allMacros: {pre: {}, post: {}},

        getMacros: function(scope) {
            return scope === 'pre' ? this._allMacros.pre : this._allMacros.post;
        },

        add: function(name, handler, scope) {
            this.getMacros(scope)[name] = handler;
        },

        process: function(klass, properties, scope) {
            Object.each(this.getMacros(scope), function(name, handler) {
                if (properties[name]) handler(klass, properties[name]);
            });
        },

        excludeMacroProperties: function(properties) {
            var result = {};
            for (var key in properties) {
                if (!this.hasMacro(key)) result[key] = properties[key];
            }
            return result;
        },

        hasMacro: function(name) {
            return !!(this._allMacros.pre[name] || this._allMacros.post[name]);
        }
    };

    macro.add('Include', include, 'pre');
})(this);

(function(global) {
    choc.macro.add('Alias', function(klass, mappings) {
        var prototype = klass.prototype;
        Object.each(mappings, function(source, aliases) {
            Array.create(aliases).each(function(alias) {
                if (prototype[source]) prototype[alias] = prototype[source];
            });
        });
    });
})(this);
