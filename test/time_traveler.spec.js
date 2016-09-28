var should = require('chai').should();
var expect = require('chai').expect;
var TimeTraveler = require('../lib/time_traveler.js');

describe('TimeTraveler', function(){
  describe('constructor', function(){
    it('converts a string to a moment', function(){
      var settings = {starts_at: "2016-10-31"};
      var traveler = new TimeTraveler(settings);

      traveler.starts_at.should.be.a('object');
      traveler.starts_at.date().should.equal(31);
      traveler.starts_at.month().should.equal(10-1);  // January = 0
      traveler.starts_at.year().should.equal(2016);
    });
  });

  describe("#validate()", function(){
    it('should return an empty array if all settings are valid', function(){
      var settings = {starts_at: "2016-10-31", steps: 10, time_units: "days"};
      var traveler = new TimeTraveler(settings);

      traveler.validate().should.be.an('array');
    });

    describe("with errors", function(){
      it("should return ['starts_at must be a valid ISO date']", function(){
        var settings = {starts_at: true, steps: 10, time_units: "days"};
        var traveler = new TimeTraveler(settings);

        traveler.validate().should.have.members(["starts_at must be a valid ISO date"]);
      });

      it("should return ['steps must be an integer']", function(){
        var settings = {starts_at: "2016-10-31", steps: 11.1, time_units: "days"};
        var traveler = new TimeTraveler(settings);

        traveler.validate().should.have.members(["steps must be an integer"]);
      });
    });
  });

  describe('#is_valid()', function(){
    it('returns TRUE if no errors', function(){
      var settings = {starts_at: "2016-10-31", steps: 10, time_units: "days"};
      var traveler = new TimeTraveler(settings);

      traveler.is_valid().should.equal(true);
    });

    it('returns FALSE if errors', function(){
      var settings = {starts_at: 10, steps: "5", time_units: "days"};
      var traveler = new TimeTraveler(settings);

      traveler.is_valid().should.equal(false);
    });
  });

  describe('#run(callback)', function(){
    it('throws error if the TimeTraveler is not valid', function(){
      var settings = {starts_at: "2016-10-31", steps: true};
      var traveler = new TimeTraveler(settings);

      traveler.run.bind(traveler, function(dt){ console.log("test"); }).should.Throw(Error, /Invalid TimeTraveler: ['steps must be an integer']/);
    });

    it('calls the given callback each interval', function(){
      var settings = {starts_at: "2016-10-31", steps: 5, time_units: "days", time_scale: 1};
      var traveler = new TimeTraveler(settings);
      var counter = 0;

      traveler.run(function(dt){ counter++; });

      counter.should.equal(5);
    });
  });
});