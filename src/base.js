(function() {
    this.Base = function(){};
    this.Base.extend = function(properties) {
        var Class = function(){};
        Class.prototype = properties;
        return Class;
    };
})();
