var TimeTraveler = require('./lib/time_traveler.js');

/**
 * Creates and runs a TimeTraveler using the given settings and callback.
 * @param {Object} settings - configuration options for the TimeTraveler object
 * @param {TimeTravelerCallback} callback - callback function that will be called on each iteration
 * @example
 * var discrete_time = require('discrete-time');
 *
 * var settings = {starts_at: "1900-10-31", steps: 100, time_units: "years"};
 * var callback = function(time){
 *  console.log("Now:" + time.now.format() + " Step:" + time.step);
 * };
 *
 * discrete_time.run(settings, callback);
 */
function run(settings, callback){
  var traveler = new TimeTraveler(settings);
  traveler.run(callback);
}

// export the discrete-time stuff
module.exports = {
  run: run
};
