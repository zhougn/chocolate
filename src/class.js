(function() {
    var macros = {
        processors: ['Extends'],

        process: function(klass, properties) {
            this.processors.forEach(function(processor) {
                this[processor](klass, properties);
            }, this);
        },

        Extends: function(klass, properties) {
            if (!properties.Extends) return;

            var superClass = properties.Extends;
            delete properties.Extends;

            try {
                superClass.__prototyping__ = true;
                klass.prototype = new superClass();
            } finally {
                delete superClass.__prototyping__;
            }
        }
    };

    this.Class = {
        create: function(properties) {
            var klass = function() {
                if (klass.__prototyping__) return;
                if (this.initialize) return this.initialize.apply(this, arguments);
            };
            if (!properties) return klass;

            properties = Object.clone(properties);
            macros.process(klass, properties);
            Object.merge(klass.prototype, properties);

            return klass;
        }
    };
})();
