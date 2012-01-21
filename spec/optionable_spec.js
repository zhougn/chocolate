describe("Optionable", function() {
    var Robot;
    beforeEach(function() {
        Robot = choc.klass({
            Include: [choc.Eventable, choc.Optionable],
            initialize: function(options) {
                this.initOptions(options);
            },
            charge: function() { this.trigger('charge'); }
        });
    });

    it("should init options", function() {
        var robot = new Robot({enableTransforming: true});

        expect(robot.options.enableTransforming).toBe(true);
    });

    it("should treat onXxx function option as event binding when Eventable is included", function() {
        var isCharging = false;
        var robot = new Robot({onCharge: function() {isCharging = true;}});

        robot.charge();

        expect(isCharging).toBe(true);
        expect(robot.options.onCharge).toBe(undefined);
    });

    it("should not treat onXxx option as event binding when it's value is not function", function() {
        var robot = new Robot({onCharge: 'not function'});

        expect(robot.options.onCharge).toBe('not function');
    });
});
