describe('klass', function() {
    describe('create klass', function() {
        it('should create klass with given properties as prototype', function() {
            var Robot = choc.klass({
                name: 'robot',
                tellName: function(){ return this.name; }
            });

            var robot = new Robot();

            expect(robot.name).toBe('robot');
            expect(robot.tellName()).toBe('robot');
        });

        it('should call initialize function when creating instance', function() {
            var Robot = choc.klass({
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

        it('should clone object and array fields when creating instance', function() {
            var Robot = choc.klass({
                arrayField: [],
                objectField: {}
            });

            var robot = new Robot();

            expect(robot.arrayField).toNotBe(Robot.prototype.arrayField);
            expect(robot.objectField).toNotBe(Robot.prototype.objectField);
        });
    });

    describe('extend klass', function() {
        it('should extend given klass', function() {
            var Robot = choc.klass();

            var Autobot = Robot.extend();

            var autobot = new Autobot();
            expect(autobot instanceof Robot).toBe(true);
        });

        it('should not call super class initialize function when extending', function() {
            var initializeCalled = false;
            var Robot = choc.klass({
                initialize: function() {
                    initializeCalled = true;
                }
            });

            var Autobot = Robot.extend();

            expect(initializeCalled).toBe(false);
        });

        it('should overwrite extended property with given property', function() {
            var Robot = choc.klass({name:'robot'});

            var Autobot = Robot.extend({name: 'autobot'});

            expect(new Autobot().name).toBe('autobot');
        });
    });

    describe('klass include', function() {
        it('should include modules to self', function() {
            var Robot = choc.klass();

            Robot.include({name: 'robot'});

            expect(new Robot().name).toBe('robot');
        });
    });


    describe('macros', function() {
        describe('basic', function() {
            it('should not implement macros as property', function() {
                var Autobot = choc.klass({Include: {}});

                expect(new Autobot().Include).toBe(undefined);
            });

            it('should not modify given properties object', function() {
                var Robot = choc.klass();
                var properties = {Extend: Robot};

                var Autobot = choc.klass(properties);

                expect(properties.Extend).toNotBe(undefined);
            });
        });

        describe('Include', function() {
            it('should include given klass', function() {
                var Transformable = choc.klass({tranform: function() {}});

                var Autobot = choc.klass({
                    Include: Transformable
                });

                expect(new Autobot().tranform).toNotBe(undefined);
            });

            it('should include given plain object', function() {
                var Transformable = {tranform: function() {}};

                var Autobot = choc.klass({
                    Include: Transformable
                });

                expect(new Autobot().tranform).toNotBe(undefined);
            });

            it('should include given instance object', function() {
                var Transformable = choc.klass({tranform: function() {}});

                var Autobot = choc.klass({
                    Include: new Transformable()
                });

                expect(new Autobot().tranform).toNotBe(undefined);
            });

            it('should include each element in given array', function() {
                var Transformable = choc.klass({tranform: function() {}});
                var Good = {campagin: 'good'};

                var Autobot = choc.klass({
                    Include: [Transformable, Good]
                });

                var autobot = new Autobot();
                expect(autobot.tranform).toNotBe(undefined);
                expect(autobot.campagin).toBe('good');
            });

            it('should overwrite included property with given property', function() {
                var Transformable = choc.klass({name:'transformer'});

                var Autobot = choc.klass({
                    Include: Transformable,
                    name: 'autobot'
                });

                expect(new Autobot().name).toBe('autobot');
            });
        });
    });
});
