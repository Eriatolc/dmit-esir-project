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
				console.log('[SensorTag] discoverServicesAndCharacteristics');
	        	sensorTag.discoverServicesAndCharacteristics(callback);
	      	},
	      	function(callback) {
	        	console.log('[SensorTag] enableIrTemperature');
	        	sensorTag.enableIrTemperature(callback);
	      	},
	      	function(callback) {
	      		console.log('[SensorTag] enableAccelerometer');
	      		sensorTag.enableAccelerometer(callback);
	      	},
	      	function(callback) {
	      		console.log('[SensorTag] enableGyroscope');
	      		sensorTag.enableGyroscope(callback);
	      	},
	      	function(callback) {
	        	setTimeout(callback, 1000);
	      	},
	      	function(callback) {
	        	console.log('[SensorTag] readIrTemperature');
	        	sensorTag.readIrTemperature(function(objectTemperature, ambientTemperature) {
	          		//console.log('\tobject temperature = %d °C', objectTemperature.toFixed(1));
	          		console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));

		          	callback();
	        	});

	        	sensorTag.on('irTemperatureChange', function(objectTemperature, ambientTemperature) {
	        		//console.log('\tambient temperature = %d °C', ambientTemperature.toFixed(1));
	        	});

	        	sensorTag.notifyIrTemperature(callback);
	      	},
	      	function(callback) {
	      		console.log('[SensorTag] readAccelerometer');
	      		sensorTag.readAccelerometer(function(x, y, z) {
	      			console.log('X : ' + x + 'g');
	      			console.log('Y : ' + y + 'g');
	      			console.log('Z : ' + z + 'g');

	      			callback();
	      		});

	      		sensorTag.on('accelerometerChange', function(x, y, z) {
	      			//console.log(self.norme(x, y, z));
	      		});

	      		sensorTag.notifyAccelerometer(callback);
	      	},
	      	function(callback) {
	      		console.log('[SensorTag] readGyroscope');
	      		sensorTag.readGyroscope(function(x, y, z) {
	      			console.log('X : ' + x + '°/s');
	      			console.log('Y : ' + y + '°/s');
	      			console.log('Z : ' + z + '°/s');
	      		});

	      		sensorTag.on('gyroscopeChange', function(x, y, z) {
	      			// console.log('X : ' + x + '°/s');
	      			// console.log('Y : ' + y + '°/s');
	      			// console.log('Z : ' + z + '°/s');

	      			//console.log('Gyro : ' + self.norme(x, y, z));
	      			self.fallDetection(x, y, z);
	      		});

	      		sensorTag.notifyGyroscope(callback);
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

SensortagDeamon.prototype.norme = function(x, y, z) {
	var norme = Math.sqrt(x*x + y*y + z*z);
	return norme;
};

SensortagDeamon.prototype.fallDetection = function(x, y, z, threshold) {
	var threshold = threshold || 250;
	var self = this;
	var norme = self.norme(x, y, z);
	if(norme >= threshold) {
		console.log('[SensorTag] Alerte ! Mémé par terre !');
	}
};

module.exports = SensortagDeamon;
