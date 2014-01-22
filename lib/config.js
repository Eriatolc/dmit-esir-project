/**
 * @file config.js
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @date 2014-01-09
 * 
 * Default configuration for DMIT-ESIR-Project
 */
var join = require('path').join;
var config = {

	// Port to run server on
	port: 8090,

	// Web ressources root path(absolute)
	root: join(__dirname, '../www'),

	// Static contents max age
	maxAge: 3600 * 24,

	// Application domain
	domain: 'localhost',

	allowedOrigins: [
		'http://' + this.domain
	]
}

module.exports = config;