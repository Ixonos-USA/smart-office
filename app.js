// NODE
var express = require('express')
  , async = require('async')
  , stylus = require('stylus')
  , nib = require('nib')
  , noble = require('noble')
  , hue = require('node-hue-api')
  , HueApi = hue.HueApi
  , lightState = hue.lightState
  , app = express()

// VARIABLES
var host = "192.168.1.246" // ip address of hue bridge
  , username = "47579c22bc617b736d9bede1976b7c3" // found at http://www.developers.meethue.com/documentation/getting-started
  , api = new HueApi(host, username)
  , state = lightState.create()
  , deviceAddress = '7c669d7770c7' // the UUID of the device to track
  , RSSI_THRESHOLD = -70 // how strong does the signal from the device need to be before being considered in range
  , lightID = 1 // which light is being controlled
  , timer


// Look for devices
noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

// Find a device, check if it's ours, then do stuff
noble.on('discover', function(peripheral) {
  var device;
  if ( peripheral.uuid === deviceAddress ) {
    console.log(peripheral.uuid + ' @ ' + peripheral.rssi)
    if ( peripheral.rssi < RSSI_THRESHOLD ) { // if the device is 'close' enough
      lightOn(lightID);
      timer = setTimeout(function(){ // if the device doesn't appear in the next X seconds, assume they left and turn the light off
        lightOff(lightID);
      }, 6000);
    }
  } else {
    clearTimeout(timer);
  }
  noble.startScanning([], true);
});

// Turn on the light
function lightOn (light) { // light ID #
  api.setLightState(light, state.on())
      .then(displayResult)
      .done();
  }

// Turn off the light
function lightOff (light) { // light ID #
  api.setLightState(light, state.off(), function(err, result) {
      if (err) throw err;
      displayResult(result);
  });
}


// TROUBLESHOOTING
var displayResult = function(result) {
  // console.log(JSON.stringify(result, null, 2)); // the result from the hue bridge (true/false)
};