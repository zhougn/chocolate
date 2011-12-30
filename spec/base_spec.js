describe('base', function() {
    describe('extend', function() {
        it('should create function with given properties as prototype', function() {
            var properties = {
                attr: 'attr',
                behavior: function(){}
            };

            var Class = Base.extend(properties);

            var instance = new Class();
            expect(instance.attr).toBe(properties.attr);
            expect(instance.behavior).toBe(properties.behavior);
        });
    });
});
