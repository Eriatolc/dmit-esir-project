/**
 * @module Operation
 * @date 2014-01-12
 * @author Clotaire Delanchy <clo.delanchy@gmail.com>
 * @copyright © Clotaire Delanchy 2014
 * @requires module:Database
 * @description
 *
 * Class representing an Alert
 */
'use strict';

// Some requirements
// ------------------
var restify = require('restify');

var db = require('../database.js');

/**
 * @lends module:Alert
 * @description
 * Operation structure:
 * {
 *      _id: ObjectId('6f35cb7179396e0d610000d9'),
 *		date: '2013-03-20 13:10:02',
 *		type: 'KeyAlert',
 * 		data: {
 *			left: 'true',
 *			right: 'false'
 *		}
 * }
 */
var Alert = module.exports = {

	/**
	 * Add a new Alert
	 *
	 * @param {Object} alert - Alert object
	 * @param {Function} next - callback function
	 * @return none
	 */
	add: function(alert) {
		// TODO: Check the data before inserting
		db.insert('alerts', alert, function(err, result) {
			if(err) {
				return console.err('error when inserting an alert!');
			}
			if(!result) {
				return conosole.err('error when inserting an alert: no result!');
			}
			console.log(JSON.stringify(result));
			console.log('alert inserted in database!');
		});
	},

	/**
	 * Edit an operation by id
	 *
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	edit: function(req, res, next) {

	},

	/**
	 * Delete an operation by id
	 *
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	del: function(req, res, next) {

	},

	/**
	 * Get an operation by id
	 *
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	get: function(req, res, next) {

	},

	/**
	 * Search in the operation collection
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	search: function(req, res, next) {

	},

	/**
	 * Check if the object ID string format
	 * @param {String} id
	 * @param {String} label - error message
	 * @return {Boolean}
	 */
	checkId: function(id, label) {
		var res;
		id.match(/^[0-9a-fA-F]{24}$/) ? res = true : res = false;
		return res;
	},

	/**
	 * Check the operation structure
	 * @param {Object} operation
	 * @param {Boolean} partial - checks a subset only
	 * @throws {restify.RestError}
	 * @return none
	 */
	checkData: function(operation, partial) {

	}
};
