var should = require('chai').should();
var discrete_time = require('../index.js');

describe('discrete-time', function(){
  describe('#traveler', function(){
    it('returns the TimeTraveler class', function(){
      discrete_time.traveler.should.be.a("function");
    });
  });

  describe('#run(settings, callback)', function(){
    it('calls the TimeTraveler.run function', function(){
      var counter = 0;
      var settings = {starts_at: "2016-10-31", steps: 5, time_units: "days", time_scale: 1};
      var callback = function(time){ counter++; };

      discrete_time.run(settings, callback);

      counter.should.equal(5);
    });
  });
});
