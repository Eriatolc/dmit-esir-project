/**
 * @class SensortagDeamon
 * @date 2014-01-09
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @requires sensortag
 * @description
 *
 * Deamon to communicate with the SensorTag
 */
'use strict';

// Script requirements
// ********************

var util = require('util');
var async = require('async');
var SensorTag = require('sensortag');
var pkg = require('../package');


function SensortagDeamon(config) {
	var self = this;

	console.log('[SensorTag] deamon created');
}

SensortagDeamon.prototype.start = function() {

	var self = this;
	console.log('[SensorTag] deamon started!');

	SensorTag.discover(function(sensorTag) {

		sensorTag.on('disconnect', function() {
			console.log('[SensorTag] disconnected!');
		});

		async.series([
			function(callback) {
				console.log('[SensorTag] connect');
				sensorTag.connect(callback);
			},
			function(callback) {
				console.log('discoverServicesAndCharacteristics');
	        	sensorTag.discoverServicesAndCharacteristics(callback);
	      	},
	      	function(callback) {
	        	console.log('readDeviceName');
	        	sensorTag.readDeviceName(function(deviceName) {
	          		console.log('\tdevice name = ' + deviceName);
	          		callback();
	        	});
	      	},
	      	function(callback) {
	        	console.log('readSystemId');
	        	sensorTag.readSystemId(function(systemId) {
	          		console.log('\tsystem id = ' + systemId);
	          		callback();
	        	});
	      	},
	      	function(callback) {
	        	console.log('enableIrTemperature');
	        	sensorTag.enableIrTemperature(callback);
	      	},
	      	function(callback) {
	      		console.log('enableAccelerometer');
	      		sensorTag.enableAccelerometer(callback);
	      	},
	      	//self.enableServices(sensorTag),
	      	function(callback) {
	        	setTimeout(callback, 2000);
	      	},
	      	function(callback) {
	        	console.log('readIrTemperature');
	        	sensorTag.readIrTemperature(function(objectTemperature, ambientTemperature) {
	          		//console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
	          		console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));

		          	callback();
	        	});

	        	sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
	        		console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
	        	});

	        	console.log('registerToTemperature change');
	        	sensorTag.notifyIrTemperature(callback);
	      	},
	      	function(callback) {
	      		console.log('readAccelerometer');
	      		sensorTag.readAccelerometer(function(x, y, z) {
	      			console.log('X : ' + x);
	      			console.log('Y : ' + y);
	      			console.log('Z : ' + z);

	      			callback();
	      		});

	      		sensorTag.on('accelerometerChange', function(x, y, z) {
	      			console.log('X : ' + x);
	      			console.log('Y : ' + y);
	      			console.log('Z : ' + z);
	      		});

	      		console.log('registerToAccelerometer change');
	      		sensorTag.notifyAccelerometer(callback);
	      	},
	      	function(callback) {
	      		sensorTag.on('simpleKeyChange', function(left, right) {
	      			if(left && right) {
	      				console.log('[SensorTag] Dos botones!');
	      			} else if(left) {
	      				console.log('[SensorTag] Boton izquierdo');
	      			} else if(right) {
	      				console.log('[SensorTag] Boton derecho');
	      			}
	      		});

	      		sensorTag.notifySimpleKey(callback);
	      	}
	      	// function(callback) {
        // 		console.log('disconnect');
        // 		sensorTag.disconnect(callback);
      		// }
	    ]);
	});
};

module.exports = SensortagDeamon;
