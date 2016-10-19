# discrete-time.js

[![Build Status](https://travis-ci.org/willdavis/discrete-time.svg?branch=master)](https://travis-ci.org/willdavis/discrete-time)
[![Coverage Status](https://coveralls.io/repos/github/willdavis/discrete-time/badge.svg?branch=master)](https://coveralls.io/github/willdavis/discrete-time?branch=master)
[![API Doc](https://doclets.io/willdavis/discrete-time/master.svg)](https://doclets.io/willdavis/discrete-time/master)

Easily step through discrete time intervals, calling functions as you go!

`discrete-time` builds on [Moment.js](http://momentjs.com/) and is designed to help with creating time series data.  
Think of it as a loop that increments time as well as an iterator.  It can be used for discrete
event simulations, but is not suitable for games or other real time simulations.

Where `discrete-time` shines is mocking data over time for use in testing, UI design, and sales demos.

## Install

```
npm install discrete-time
```

## Basic Usage

```
var discrete_time = require('discrete-time');
var settings = { starts_at: "2016-10-31", steps: 100, time_units: "days" };

var callback = function(dt){
  console.log(dt);  // { now: [moment], step: [integer] }
};

discrete_time.run(settings, callback);
```

The `callback` function accepts one parameter for the current time in the loop.
For more information see the [TimeTravelerCallback](https://doclets.io/willdavis/discrete-time/master#dl-TimeTravelerCallback) definition in the API docs.

## Using the TimeTraveler class

```
var TimeTraveler = require('discrete-time').traveler;

var settings = { starts_at: "2015-10-21", steps: 5, time_units: "years" };
var traveler = new TimeTraveler(settings);

traveler.current.step       // the current step of the time series
traveler.current.time       // the current moment of the time series

traveler.step_forward();    // manually increment by one step/time unit
traveler.step_backwards();  // manually decrement by one step/time unit

traveler.run(callback);     // steps forward through all steps in the time series
```

For additional information, see the [API Docs](https://doclets.io/willdavis/discrete-time/master#dl-TimeTraveler)

## Contributing

- Fork this repo
- Make changes and add tests
- Create pull request
- ???
- Profit
