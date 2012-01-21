/**
 * @depend core.js
 */
(function() {
    choc.Optionable = choc.klass({
        initOptions: function(options) {
            this.options = Object.merge({}, options);

            if (!this.on) return;

            for (var key in this.options) {
                if (/^on[A-Z]/.test(key) && Object.isFunction(this.options[key])) {
                    var eventType = key.replace(/^on([A-Z])/, function(key, firstChar) { return firstChar.toLowerCase(); });
                    this.on(eventType, this.options[key]);
                    delete this.options[key];
                }
            }
        }
    });
})();
