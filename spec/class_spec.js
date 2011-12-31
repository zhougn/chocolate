describe('Class', function() {
    describe('create', function() {
        it('should create function with given properties as prototype', function() {
            var Robot = Class.create({
                name: 'robot',
                tellName: function(){ return this.name; }
            });

            var robot = new Robot();

            expect(robot.name).toBe('robot');
            expect(robot.tellName()).toBe('robot');
        });

        it('should call initialize function when creating instance', function() {
            var Robot = Class.create({
                initialize: function(name) {
                    this.name = name;
                },
                tellName: function() {
                    return this.name;
                }
            });

            var robot = new Robot('Optimus Prime');

            expect(robot.tellName()).toBe('Optimus Prime');
        });

        describe('macros', function() {
            it('should not implement macros as property', function() {
                var Robot = Class.create();

                var Autobot = Class.create({
                    Extends: Robot
                });

                expect(new Autobot().Extends).toBe(undefined);
            });

            it('should not modify given properties object', function() {
                var Robot = Class.create();
                var properties = {Extends: Robot};

                var Autobot = Class.create(properties);

                expect(properties.Extends).toNotBe(undefined);
            });
        });

        describe('inheritance', function() {
            it('should extends given klass', function() {
                var Robot = Class.create();
                var Autobot = Class.create({
                    Extends: Robot
                });

                var autobot = new Autobot();
                expect(autobot instanceof Robot).toBe(true);
            });

            it('should not call super class initialize function when creating sub class', function() {
                var initializeCalled = false;
                var Robot = Class.create({
                    initialize: function() {
                        initializeCalled = true;
                    }
                });

                var Autobot = Class.create({
                    Extends: Robot
                });

                expect(initializeCalled).toBe(false);
            });

            it('should overwrite super class property when there is same name property', function() {
                var Robot = Class.create({name:'robot'});

                var Autobot = Class.create({
                    name: 'autobot',
                    Extends: Robot
                });

                expect(new Autobot().name).toBe('autobot');
            });
        });
    });
});
