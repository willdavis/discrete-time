var moment = require('moment');
var TimeTraveler = require('./lib/time_traveler.js');

module.exports = {
  run: function (settings, callback){
    var traveler = new TimeTraveler(settings);
    traveler.run(callback);
  }
};
