describe('Eventable', function() {
    var Robot = choc.klass({
        Include: choc.Eventable
    });
    var robot;
    beforeEach(function() {
        robot = new Robot();
    });

    describe('trigger', function() {
        it('should trigger event handler with arguments', function() {
            robot.name = 'hello';
            robot.charge = function() { this.trigger('charge', ['30%']); };
            var percentage = '';
            robot.on('charge', function(arg) { percentage = arg; });

            robot.charge();

            expect(percentage).toBe('30%');
        });

        it('should trigger event handler with self as binding scope', function() {
            robot.charge = function() { this.trigger('charge'); };
            var scope;
            robot.on('charge', function(arg) { scope = this; });

            robot.charge();

            expect(scope).toBe(robot);
        });

        it('should trigger event handler with a delay', function() {
            robot.charge = function() { this.trigger('charge', [], 200); };
            var handlerCalled = false;
            robot.on('charge', function() { handlerCalled = true; });

            robot.charge();

            expect(handlerCalled).toBe(false);
            waits(300);
            runs(function() {
                expect(handlerCalled).toBe(true);
            });
        });
    });

    describe('on', function() {
        it('should support binding multi event handlers', function() {
            var isCharging = false, isMoving = false;
            robot.charge = function() { this.trigger('charge'); return this; };
            robot.move = function() { this.trigger('move'); return this; };

            robot.on({
                'charge': function() {
                    isCharging = true;
                },
                'move': function() {
                    isMoving = true;
                }
            });

            robot.charge().move();
            expect(isCharging).toBe(true);
            expect(isMoving).toBe(true);
        });
    });

    describe('off', function() {
        it('should remove event handlers by type', function() {
            var handlerCalled = false;
            robot.charge = function() { this.trigger('charge'); };
            robot.on('charge', function() { handlerCalled = true; });
            robot.on('charge', function() { handlerCalled = true; });

            robot.off('charge');

            robot.charge();
            expect(handlerCalled).toBe(false);
        });

        it('should remove specific event handler by type', function() {
            robot.charge = function() { this.trigger('charge'); };
            var handler1Called = false, handler2Called = false;
            var handler1 = function() { handler1Called = true; };
            var handler2 = function() { handler2Called = true; };
            robot.on('charge', handler1);
            robot.on('charge', handler2);

            robot.off('charge', handler1);

            robot.charge();
            expect(handler1Called).toBe(false);
            expect(handler2Called).toBe(true);
        });
    });
});
