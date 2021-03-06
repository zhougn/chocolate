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
                var Transformable = choc.klass({transform: function() {}});

                var Autobot = choc.klass({
                    Include: Transformable
                });

                expect(new Autobot().transform).toNotBe(undefined);
            });

            it('should include given plain object', function() {
                var Transformable = {transform: function() {}};

                var Autobot = choc.klass({
                    Include: Transformable
                });

                expect(new Autobot().transform).toNotBe(undefined);
            });

            it('should include given instance object', function() {
                var Transformable = choc.klass({transform: function() {}});

                var Autobot = choc.klass({
                    Include: new Transformable()
                });

                expect(new Autobot().transform).toNotBe(undefined);
            });

            it('should include each element in given array', function() {
                var Transformable = choc.klass({transform: function() {}});
                var Good = {campagin: 'good'};

                var Autobot = choc.klass({
                    Include: [Transformable, Good]
                });

                var autobot = new Autobot();
                expect(autobot.transform).toNotBe(undefined);
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

        describe("Alias", function() {
            it("should create alias properties by given mappings", function() {
                var Autobot = choc.klass({
                    Alias: {'name': 'fullname', 'transform': ['shift', 'deform']},
                    name: 'autobot',
                    transform: function() { }
                });

                var robot = new Autobot();
                expect(robot.fullname).toBe(robot.name);
                expect(robot.shift).toBe(robot.transform);
                expect(robot.deform).toBe(robot.transform);
            });
        });

        describe("Delegate", function() {
            it("should create delegate function for non function property", function() {
                var currentCharge = '30%';
                var isCharging = false;

                var Robot = choc.klass({
                    battery: {currentCharge: currentCharge, isCharging: isCharging},
                    Delegate: {'battery': ['isCharging', 'currentCharge']}
                });

                var robot = new Robot();
                expect(robot.currentCharge()).toBe(currentCharge);
                expect(robot.isCharging()).toBe(isCharging);
            });

            it("should create delegate function for function property", function() {
                var Robot = choc.klass({
                    battery: {remainingChargeTime: 0, charge: function(fixedPeriod) { this.remainingChargeTime = fixedPeriod; }},
                    Delegate: {'battery': 'charge'}
                });

                var robot = new Robot();
                robot.charge(60);
                expect(robot.battery.remainingChargeTime).toBe(60);
            });
        });
    });
});
