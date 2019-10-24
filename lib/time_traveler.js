var moment = require('moment');

/**
 * Encapsulates helper functions and attributes to create and step
 * through time series data.
 *
 * @example
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
  this.time_scale = settings.time_scale || 1;
  this.current = { time: starts_at_moment, step: 0 };
}

/**
 * This callback function provides access to the TimeTraveler's current step & time.
 * Anything you want done during the {@link TimeTraveler#run} function should be defined here.
 * @callback TimeTravelerCallback
 * @param {Object} current
 * @param {moment} current.time - current moment of the time series
 * @param {integer} current.step - current step of the time series
 */

// -------------
// class methods
// -------------

/**
 * Iterates through the time series passing the current step/time to the
 * {@link TimeTravelerCallback} function.
 * @example
 * var settings = {starts_at: "2016-10-31", steps: 10, time_units: "days"};
 * var traveler = new TimeTraveler(settings);
 * var callback = function(time){
 *  console.log("Now:" + time.now.format() + " Step:" + time.step);
 * };
 *
 * traveler.run(callback);
 * @param {TimeTravelerCallback} callback - the function to call on each step
 * @throws {Error} invalid TimeTraveler
 */
TimeTraveler.prototype.run = function(callback) {
  if(!this.is_valid()){ throw new Error("Invalid TimeTraveler: " + this.validate()); }

  for(i=0; i < this.steps; i++){
    callback({step: this.current.step, now: this.current.time});
    this.step_forward();
  }
};

/**
 * Asynchronously iterates through the time series, passing the current step/time
 * to the {@link TimeTravelerCallback} function. Returns a Promise.
 * @example
 * var settings = {starts_at: "2016-10-31", steps: 10, time_units: "days"};
 * var traveler = new TimeTraveler(settings);
 * var callback = function(time){
 *  console.log("Now:" + time.now.format() + " Step:" + time.step);
 * };
 *
 * traveler.runAsync(callback).then(do_other_stuff).catch(any_errors);
 * @param {TimeTravelerCallback} callback - the function to call on each step
 * @returns {Promise}
 */
TimeTraveler.prototype.runAsync = function(callback) {
  var traveler = this;
  return new Promise(function(resolve, reject) {
    if(!traveler.is_valid()){ reject(Error("Invalid TimeTraveler: " + traveler.validate())); }

    for(i=0; i < traveler.steps; i++){
      callback({step: traveler.current.step, now: traveler.current.time});
      traveler.step_forward();
    }

    resolve();
  });
}

/**
 * Increments the TimeTraveler by one step/time unit
 * @example
 * var settings = { starts_at: "2016-10-31", time_units: "days" };
 * var traveler = new TimeTraveler(settings);
 *
 * console.log(traveler.current.step);   // 0
 * console.log(traveler.current.time);   // 2016-10-31
 *
 * traveler.step_forward();
 *
 * console.log(traveler.current.step);   // 1
 * console.log(traveler.current.time);   // 2016-11-01
 */
TimeTraveler.prototype.step_forward = function() {
  this.current.step++;
  this.current.time.add(this.time_scale, this.time_units);
};

/**
 * Decrements the TimeTraveler by one step/time unit
 * @example
 * var settings = { starts_at: "2016-10-31", time_units: "years" };
 * var traveler = new TimeTraveler(settings);
 *
 * console.log(traveler.current.step);   // 0
 * console.log(traveler.current.time);   // 2016-10-31
 *
 * traveler.step_backward();
 *
 * console.log(traveler.current.step);   // -1
 * console.log(traveler.current.time);   // 2015-10-31
 */
TimeTraveler.prototype.step_backward = function() {
  this.current.step--;
  this.current.time.subtract(this.time_scale, this.time_units);
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
