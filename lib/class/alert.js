/**
 * @module Alert
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

	addAlert: function(req ,res, next) {
		return next();
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

		console.log('req : ' + JSON.stringify(req.body.id));
		var idOK = Alert.checkId(req.params.id);
		if (!idOK) {
			var idMessage = 'alert ID';
			return next(new restify.InvalidArgumentError(idMessage));
		}

		var id = db.getObjID(req.params.id);
		db.findOne('alerts', { _id: id }, function(err, result) {
			if (err) return next(err);
			if(!result) {
				var message = 'Cannot find ressource corresponding';
				return next(new restify.ResourceNotFoundError(message));
			}
			result = result;
			console.log('get result : ' + JSON.stringify(result));
			res.send(result);
			return next();
		});
	},

	/**
	 * Search in the operation collection
	 * @param {Object} req - HTTP request
	 * @param {Object} res - HTTP response
	 * @param {Function} next - callback function
	 * @return none
	 */
	search: function(req, res, next) {
		var params = req.params || {};
		var search = {};

		// Get filters
		var filters = {
			limit: params.offset || 20,
			skip: (params.pg-1)*params.offset || 0,
			sort: params.sort ? [[params.sort, params.dir || -1]] : null
		};

		// Get search criterias
		for (var param in params) {
				if (param === 'offset'
				|| param === 'pg'
				|| param === 'dir'
				|| param === 'sort'	) {
					continue;
			}

			search[param] = params[param];
		}

		// Find item
		db.count('operations', search, filters, function(err, count) {
			if (err) return next(err);
			if(count == 0) {
				var report = {
					nb: count,
					pg: 1,
					offset: filters.limit,
					items: []
				};
				res.send(report);
				return next();
			} else {
				db.find('operations', search, filters, function(err, results) {
					if (err) return next(err);
					results = results || [];
					var report = {
						nb: count,
						pg: (filters.skip/filters.limit)+1,
						offset: filters.limit,
						items: results
					};
					res.send(report);
					return next();
				});
			}
		});
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
