var moment = require('moment');

/**
 * Encapsulates helper functions and attributes to create and step
 * through time series data.
 *
 * @example <caption>Creating and running new TimeTraveler objects</caption>
 * var settings = { starts_at: "2016-10-31", steps: 100, time_units: "days", time_scale: 10 };
 * var TimeTraveler = require('discrete-time').traveler;
 * var traveler = new TimeTraveler(settings);
 *
 * // send the TimeTraveler on their journey!
 * traveler.run(function(dt){ console.log('hello world'); });  // outputs "hello world" 100 times
 * @constructor
 * @param {Object} settings
 * @param {(moment|string)} settings.starts_at - Sets the starting point for the time series
 * @param {integer} settings.steps - The total number of intervals in the time series
 * @param {integer} [settings.time_scale=1] - The number of time units per interval in the time series.
 * @param {string} settings.time_units - The units of time to use for the time series.
 *
 * @property {moment} starts_at - Moment.js representation of the start time
 * @property {integer} steps - Total number of intervals in the time series
 * @property {string} time_units - The units of time for each time series interval
 * @property {integer} time_scale - The number of time units per time series interval
 * @property {object} current - Tracks the current state of the TimeTraveler object
 * @property {moment} current.time - The current moment the TimeTraveler is at
 * @property {integer} current.step - The current step the TimeTraveler is at
 */
function TimeTraveler(settings) {

  // coerce the +starts_at+ value into a moment
  var starts_at_moment = moment(settings.starts_at);

  // initialize new TimeTraveler object attributes
  this.starts_at = starts_at_moment;
  this.steps = settings.steps;
  this.time_units = settings.time_units;
  this.time_scale = settings.time_scale;
  this.current = { time: starts_at_moment, step: 0 };
}

/**
 * This callback is the interface to the TimeTraveler run function.
 * All simulation logic should be contained here and will be called once per interval.
 * @callback TimeTravelerCallback
 * @param {Object} time
 * @param {moment} time.now - current time of the simulation
 * @param {integer} time.step - current step in the time series
 */

// -------------
// class methods
// -------------

/**
 * Runs through the time series using the given callback function at each interval
 * @param {TimeTravelerCallback} callback - the function to call on each step
 * @throws {Error} If the TimeTraveler is not valid
 */
TimeTraveler.prototype.run = function(callback) {
  if(!this.is_valid()){ throw new Error(`Invalid TimeTraveler: ${this.validate()}`); }

  for(i=0; i < this.steps; i++){
    callback({step: this.current.step, now: this.current.time});

    this.current.step++;
    this.current.time.add(this.time_scale, this.time_units);
  }
};

/**
 * Validates the TimeTraveler and returns an array with any error messages
 * @example
 * var settings = {starts_at: "2016-10-31", steps: true};
 * var traveler = new TimeTraveler(settings);
 * traveler.validate();   // returns ["steps must be an integer"]
 * @returns {array} an array of error messages.  If the array is empty then the TimeTraveler is valid
 */
TimeTraveler.prototype.validate = function() {
  var errors = [];

  if(!this.starts_at.isValid()){ errors.push("starts_at must be a valid ISO date"); }
  if(!Number.isInteger(this.steps)){ errors.push("steps must be an integer"); }

  return errors;
};

/**
 * Calls #validate and returns true if the errors array is empty
 * @example
 * var settings = {starts_at: "2016-10-31", steps: true};
 * var traveler = new TimeTraveler(settings);
 * traveler.is_valid();   // false
 * @returns {boolean}
 */
TimeTraveler.prototype.is_valid = function() {
  var errors = this.validate();

  if(errors.length === 0){
    return true;
  }else {
    return false;
  }
};

// export the class
module.exports = TimeTraveler;
