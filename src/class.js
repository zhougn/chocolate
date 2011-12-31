(function() {
    function Extends(klass, properties) {
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

    var preProcesses = [Extends];

    this.Class = {
        create: function(properties) {
            var klass = function(){
                if (klass.__prototyping__) return;
                if (this.initialize) return this.initialize.apply(this, arguments);
            };
            if(!properties) return klass;

            preProcesses.forEach(function(process) {
                process(klass, properties);
            });

            Object.merge(klass.prototype, properties);

            return klass;
        }
    };
})();
