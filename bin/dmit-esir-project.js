#!/usr/bin/env node

/******************************************************************************
 * @file dmit-esir-project.js                                                 *
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>                         *
 * @date 2014-01-09                                                           *
 *                                                                            *
 * This is the CLI executable to start the DMIT ESIR Project                  *
 *                                                                            *
 *****************************************************************************/
'use strict';

// Some requirements
// ----------------------------------------------------------------------------
var fs = require('fs');
var path = require('path');
var prog = require('commander');

var pkg = require('../package');
var server = require('../lib/server.js');
var SensorTagDeamon = require('../lib/sensortagDeamon.js');
var config = path.join(__dirname, '../lib/config.js');

// CLI handling and Configuration
// ----------------------------------------------------------------------------

// Add infos to help menu
prog.on('--help', function() {
	console.log('  Example to use dmit-esir-project\n');
	console.log('    $ sudo ./bin/dmit-esir-project.js\n');
});

// Interprete CLI arguments
prog.version('Version ' + pkg.version + '\t© ' + pkg.author)
	.option('-p, --port <n>', 'Port to bind the server [8090]', parseInt)
	.option('-c, --conf <path>', 'configuration path [./config.js]', String, config)
	.parse(process.argv);

// Import configuration file if exists
if (prog.conf) {
	prog.conf = path.normalize(prog.conf);
	if (prog.conf.substr(0,1) !== '/') prog.conf = join(__dirname, prog.conf)
	try { config = require(prog.conf) }
	catch (err) {
		console.error('Misformed or not found configuration file.')
		throw new Error(err);
	}
}

// Override configuration with CLI inputs
if (prog.port) config.port = prog.port;

// Start the server
// ----------------------------------------------------------------------------
var httpServer = new server( config );
httpServer.run();

// Start the SensorTag Deamon
var sensorTagDeamon = new SensorTagDeamon();
sensorTagDeamon.start();