(function() {
    choc.Eventable = choc.Class.create({
        _events: {},

        on: function(type, fn) {
            if (Object.isObject(type)) {
                var self = this;
                Object.each(type, function(key, value) { self.on(key, value); });
                return this;
            }

            this._events[type] = this._events[type] || [];
            this._events[type].push(fn);

            return this;
        },

        trigger: function(type, args, delay) {
            var fns = this._events[type];
            if (!fns) return this;

            args = Array.create(args).compact();
            if (delay > 0) {
                setTimeout(function() {
                    fns.forEach(function(fn) { fn.apply(this, args); }, this);
                }.bind(this), delay);
            } else {
                fns.forEach(function(fn) { fn.apply(this, args); }, this);
            }

            return this;
        },

        off: function(type, fn) {
            if (arguments.length < 2) {
                delete this._events[type];
                return this;
            }

            this._events[type] && this._events[type].remove(function(existingFn) { return existingFn === fn; });

            return this;
        }
    });
})();
