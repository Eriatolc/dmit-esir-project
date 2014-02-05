/**
 * @class SensortagDaemon
 * @date 2014-01-09
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @requires sensortag
 * @description
 *
 * Daemon to communicate with the SensorTag
 */
'use strict';

// Script requirements
// ********************

var util = require('util');
var async = require('async');
var SensorTag = require('sensortag');
var pkg = require('../package');

/*
 * Constructor of the Sensortag Daemon
 */
function SensortagDaemon(server) {
	var self = this;
	this._server = server;
	console.log('[SensorTag] daemon created');
}

/**
 * Action the daemon is doing:
 * - discovering the closest SensorTag,
 * - enable accelerometer, gyroscope, temperature and buttons features,
 * - read this values once,
 * - trigger alerts if specific events arrive (fall for instance).
 * @return none
 */
SensortagDaemon.prototype.start = function() {

	var self = this;
	console.log('[SensorTag] daemon started!');

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
	        		if(ambientTemperature.toFixed(1) <= 10 || ambientTemperature.toFixed(1) >= 30) {
	        			self.sendTempAlert(ambientTemperature.toFixed(1));
	        		}
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
	      			self.sendKeyAlert(left, right);
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

/**
 * Calculate the norm of the vector (x, y ,z) given in parameter
 * @param x - value for the x axis
 * @param y - value for the y axis
 * @param z - value for the z axis
 * @return norm of the vector
 */
SensortagDaemon.prototype.norme = function(x, y, z) {
	var norme = Math.sqrt(x*x + y*y + z*z);
	return norme;
};

/**
 * Algorithm to detect if a fall appeared. It uses the norm of the vector and a threshold.
 * @param x - value for the x axis
 * @param y - value for the y axis
 * @param z - value for the z axis
 * @param threshold - value of the threshold
 */
SensortagDaemon.prototype.fallDetection = function(x, y, z, threshold) {
	var threshold = threshold || 250;
	var self = this;
	var norme = self.norme(x, y, z);
	
	if(norme >= threshold) {
		console.log('[SensorTag] Alerte ! Mémé par terre !');
		self.sendFallAlert(x, y, z, threshold, norme);
	}
};

SensortagDaemon.prototype.sendFallAlert = function(x, y ,z, threshold, norme) {
	var self = this;
	var alert = {
		type: 'FallAlert',
		data: {
			x: x,
			y: y,
			z: z,
			threshold: threshold,
			norme: norme
		}
	};
	this._server.notifyFallAlert(alert);
};

SensortagDaemon.prototype.sendDisconnectAlert = function() {

};

SensortagDaemon.prototype.sendTempAlert = function(temperature) {
	var self = this;
	var alert = {
		type: 'TempAlert',
		data: {
			temp: temperature
		}
	};
	this._server.notifyTempAlert(alert);
};

SensortagDaemon.prototype.sendKeyAlert = function(left, right) {
	var self = this;
	var alert = {
		type: 'KeyAlert',
		data: {
			left: left,
			right: right
		}
	};
	this._server.notifyKeyAlert(alert);
};

module.exports = SensortagDaemon;
