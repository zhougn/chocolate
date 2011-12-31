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
                    Extend: Robot
                });

                expect(new Autobot().Extend).toBe(undefined);
            });

            it('should not modify given properties object', function() {
                var Robot = Class.create();
                var properties = {Extend: Robot};

                var Autobot = Class.create(properties);

                expect(properties.Extend).toNotBe(undefined);
            });
        });

        describe('Extend', function() {
            it('should extend given klass', function() {
                var Robot = Class.create();
                var Autobot = Class.create({
                    Extend: Robot
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
                    Extend: Robot
                });

                expect(initializeCalled).toBe(false);
            });

            it('should overwrite extended property with given property', function() {
                var Robot = Class.create({name:'robot'});

                var Autobot = Class.create({
                    name: 'autobot',
                    Extend: Robot
                });

                expect(new Autobot().name).toBe('autobot');
            });
        });

        describe('Include', function() {
            it('should include given klass', function() {
                var Transformable = Class.create({tranform: function() {}});

                var Autobot = Class.create({
                    Include: Transformable
                });

                expect(new Autobot().tranform).toNotBe(undefined);
            });

            it('should include given object', function() {
                var Transformable = {tranform: function() {}};

                var Autobot = Class.create({
                    Include: Transformable
                });

                expect(new Autobot().tranform).toNotBe(undefined);
            });

            it('should include each element in given array', function() {
                var Transformable = Class.create({tranform: function() {}});
                var Good = {campagin: 'good'};

                var Autobot = Class.create({
                    Include: [Transformable, Good]
                });

                var autobot = new Autobot();
                expect(autobot.tranform).toNotBe(undefined);
                expect(autobot.campagin).toBe('good');
            });

            it('should overwrite included property with given property', function() {
                var Transformable = Class.create({name:'transformer'});
                var Autobot = Class.create({
                    Include: Transformable,
                    name: 'autobot'
                });

                expect(new Autobot().name).toBe('autobot');
            });

            it('should overwrite extended properties with included properties', function() {
                var Robot = Class.create({name:'robot'});
                var Transformable = Class.create({
                    name: 'transformer',
                    tranform: function(){}
                });

                var Autobot = Class.create({
                    Extend: Robot,
                    Include: Transformable
                });

                expect(new Autobot().name).toBe('transformer');
            });
        });
    });
});
