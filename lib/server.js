/**
 * @class Server
 * @date 2014-01-09
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @requires restify
 * @description
 *
 * HTTP server: provides file & REST services
 */
'use strict';

// Script requirements
// ********************
var restify = require('restify');
var path = require('path');
var join = path.join;
var pkg = require('../package');
var Alert = require('./class/alert.js');
var fs = require('fs');

function Server(config) {
	var self = this;

	// Create server instance
	// ***********************
	var server = restify.createServer({
		name: pkg.name,
		version: pkg.version
	});

	// Set private vars
	// *****************
	this._server = server;
	this._config = config;

	// Restify plugins (middlewares)
	// ******************************
	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser());
	server.use(restify.CORS({ origins: config.allowedOrigins }));
	server.use(restify.dateParser());
	server.use(restify.gzipResponse());
	server.use(restify.bodyParser({ mapParams: false }));
	server.use(restify.conditionalRequest());

	// Redirections
	// *************
	server.pre(function redirect(req, res, next) {
		//console.log(req.url);
		var location;

		switch (req.url) {
			/* redirects to portal index page */
			case '/':
			case '/portal':
			case '/portal/':
				res.header('Location', '/portal/index.html');
				res.send(302);
				self.log(req, res);
				return next(false); /* stop next tick */

			/* redirects to admin index page */
			case '/admin':
			case '/admin/':
				res.header('Location', '/admin/index.html');
				res.send(302);
				self.log(req, res);
				return next(false); /* stop next tick */

			/* do not redirect by default */
			default:
				return next();
		}
	});

	// Log the request
	// ****************
	server.on('after', self.log);

	// Portal static routes
	// *********************
	server.get(/^\/portal.*/, restify.serveStatic({
		directory: path.join(__dirname, '../www'),
		maxAge: config.maxAge,
		default: 'index.html'
	}));

	// Admin static routes
	// ********************
	server.get(/^\/admin.*/, restify.serveStatic({
		directory: path.join(__dirname, '../www'),
		maxAge: config.maxAge,
		default: 'index.html'
	}));


	/************************\
	*                        *
	*      Restfull API      *
	*                        *
	\************************/

	// Get API
	server.get('/api', function(req, res, next) {
		res.send( self.getAPI() );
		next(false);
	});

	// Get API version
	server.get('/api/version', function(req, res, next) {
		res.send( { version: pkg.version } );
		next(false);
	});

	// Alert manipulation
	server.put('/api/alert', Alert.addAlert);
	server.get('/api/alert/:id', Alert.get);
	server.get('/api/search/alert', Alert.search);
	server.get('/api/search/alert/:offset/:pg', Alert.search);
}

/** 
 * Start the HTTP server listener
 * @return none
 */
Server.prototype.run = function() {
	var config = this._config;

	// Error handler
	this._server.on('error', function onError(e) {
		switch (e.code) {
			case 'EADDRINUSE':
				console.error('port ' + config.port + ' already in use');
				return process.exit(1);

			case 'EACCES':
				console.error('not allowed to bind port ' + config.port);
				return process.exit(1);

			default:
				console.error(e.code);
				return process.exit(1);
		}
	});

	// Start listening
	this._server.listen(config.port, function() {
		console.info('[Server] HTTP Server bound to port ' +  config.port);
	});
};

/**
 * Log the current request / reponse.
 *
 * @param {Object} req - HTTP request
 * @param {Object} res - HTTP response
 * @return none
 */
Server.prototype.log = function(req, res) {
	var ipAddress = req.headers['x-forwarded-for'] === undefined ? req.connection.remoteAddress : req.headers['x-forwarded-for'];
	var responseTime = (res._headers && res._headers.hasOwnProperty('x-response-time') ? res._headers['x-response-time']+'ms' : '');
	console.log(ipAddress + ' ' + req.method + ' ' + req.url + ' ' + res.statusCode + ' ' + responseTime);
};

/**
 * Get the REST server API
 * @return {Object} API ordered by HTTP Method
 */
Server.prototype.getAPI = function() {
	if (!this._API) {
		var API, routes, route, mtd, i;
		API = {};
		routes = this._server.router.routes;
		for (mtd in routes) {
			API[mtd] = [];
			for (i in routes[mtd]) {
				route = routes[mtd][i];
				// Filter static routes
				if (!route.spec.path.match(/^\/api/)) continue;

				// Push to the API private obj
				API[mtd].push({
					method: route.spec.method,
					path: route.spec.path,
					versions: route.spec.versions
				});
			}
		}
		this._API = API;
	}
	return this._API;
};

/**
 * Catch a new FallAlert from the SensorTagDaemon and write it both in the database and the file
 *
 * @param {Object} alert - FallAlert received
 * @return none
 */
Server.prototype.notifyFallAlert = function(alert) {
	var self = this;
	var date = new Date();
	alert.date = date;
	console.log('[Server] ' + date.toDateString() + ' - FallAlert received!');
	Alert.add(alert);
	self.writeData(alert);
};

/**
 * Catch a new DisconnectAlert from the SensorTagDaemon and write it both in the database and the file
 *
 * @param {Object} alert - DisconnectAlert received
 * @return none
 */
Server.prototype.notifyDisconnectAlert = function(alert) {
	// TODO
};

/**
 * Catch a new KeyAlert from the SensorTagDaemon and write it both in the database and the file
 *
 * @param {Object} alert - KeyAlert received
 * @return none
 */
Server.prototype.notifyKeyAlert = function(alert) {
	var self = this;
	var date = new Date();
	alert.date = date;
	var left = alert.data.left;
	var right = alert.data.right;
	if(left && right) {
		Alert.add(alert);
	} else if(left) {
		Alert.add(alert);
	} else if(right) {
		Alert.add(alert);
	}
	console.log('[Server] ' + date.toDateString() + ' - KeyAlert received!');
	self.writeData(alert);
};


/**
 * Catch a new TempAlert from the SensorTagDaemon and write it both in the database and the file
 *
 * @param {Object} alert - TempAlert received
 * @return none
 */
Server.prototype.notifyTempAlert = function(alert) {
	var self = this;
	var date = new Date();
	alert.date = date;
	console.log('[Server] ' + date.toDateString() + ' - TempAlert received!');
	Alert.add(alert);
	self.writeData(alert);
};

/**
 * Write the alerts on a text file, which will be read by the Processing team
 *
 * @param {Object} alert - alert to append to the file
 * @return none
 */
Server.prototype.writeData = function(alert) {

	// Construct the line to add
	var date = new Date(alert.date);
	var year = date.getFullYear();
	console.log('year : ' + year);
	var month = date.getMonth() + 1;
	console.log('month : ' + month);
	var day = date.getDate();
	console.log('day : ' + day);
	var hour = date.getUTCHour();
	var minutes = date.getUTCMinutes();
	var buttons = 0;
	var fall = 0;
	var temp = 18.0;

	if(alert.type == 'KeyAlert') {
		if(alert.data.right && alert.data.left) {
			buttons = 3;
		} else if (alert.data.right && !alert.data.left) {
			buttons = 1;
		} else if (!alert.data.right && alert.data.left) {
			buttons = 2;
		} else {
			buttons = 0;
		}
	} else if(alert.type == 'FallAlert') {
		fall = 1;
	}

	// Append the line: date - left button - right button - fall (I/0) - temperatureIR
	var line = day + '/' + month + '/' + year + '/' + hour + '/' + minutes + ';' + buttons + ';' + fall + ';' + temp + '\n';
	fs.appendFile('/home/eriatolc/test.txt', line, function(err) {
		if(err) {
			console.log(err);
		} else {
			console.log('file is written');
		}
	});
}

// Export it
module.exports = Server;
