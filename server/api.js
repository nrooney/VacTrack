var Q = require("q"),
restify = require("restify");

module.exports = function rest_api(options) {
	"use strict";

	var db = options.db;
	var server = options.server;

	var default_version = "1";
	var supported_versions = ["1"];
	// Maximum Events sent back in group
	var total_events_limit = 50;

	//TODO: document these things
	var shared_params = {
		// TODO: Req/optional parameters?
		offset: function check_offset(offset, dflt) {
			var return_offset = dflt;

			if (offset) {
				var offset = parseInt(offset, 10);
				if (isNaN(offset) || offset < 0) {
					throw new restify.InvalidArgumentError("Is that really a valid offset? Honestly?");
				} else {
					return_offset = offset
				}
			}

			return return_offset;
		},
	};

	// TODO: Non-shared parameters
	function build_params(param_details, incoming_params) {
		var params = {};

		for (var param in param_details) {
			params[param] = shared_params[param](incoming_params[param], param_details[param].dflt);
		}

		return params;
	}

	function map_route(endpoint, http_method, parameters, callback_fun) {
		var wrapped_callback = function wrapped_callback(req, res, next) {
			Q.try(function () {
				var params = build_params(parameters, req.params);

				return callback_fun(params);
			})
				.catch(function global_error(error) {
					return next(error);
				}).done(function global_done(value) {
					res.send(value);
					return next();
				});
		};

		server[http_method](endpoint, wrapped_callback);
	}

	function sanitize_rows_function(row_list) {
		return function sanitize_rows(rows) {
			return rows.map(function sanitize_row(row) {
				var sanitized_row = {};

				for (var column in row) {
					if (row.hasOwnProperty(column) && (row_list.indexOf(column) != -1)) {
						sanitized_row[column] = row[column];
					}
				}

				return sanitized_row;
			});
		};
	}

	var sanitize_transactions = sanitize_rows_function(["id", "amount", "person"]);

	map_route(
		"/rest/hello",
		"get",
		{},
		function api_hello(params) {
			var response = {
				hello: "Hello, traveller. VacTrack REST API",
				default_version: default_version,
				supported_versions: supported_versions
			};

			var db_promise = Q.ninvoke(db, "all", "SELECT 1;").then(function(rows) {
				if (rows && rows.length === 1) {
					response.db = "1";
				}

				return response;
			});

			return db_promise;
		});

	map_route(
		"/rest/events",
		"get",
		{offset: { dflt: 0 }},
		function get_events(params) {

			var db_promise = Q.ninvoke(db, "all", "SELECT * FROM tEvent ORDER BY id LIMIT $total_events OFFSET $event_offset;",
									   {$total_events: total_events_limit, $event_offset: params.offset});

			var response = {};

			return db_promise.then(function(rows) {
				if (!rows || rows.length == 0) return;

				response = rows;

				return Q.all(
					rows.map(function get_transactions(row) {
						return Q.ninvoke(db, "all", "SELECT * from tTransaction WHERE event = $event", {$event: row.id})
							.then(function(t_rows) {
								row.transactions = sanitize_transactions(t_rows);
							});
					})
				);
			}).then(function() {
				return response;
			});
		});

	map_route(
		"/rest/people",
		"get",
		{},
		function get_people(req, res) {
			//TODO: Offsets?

			var db_promise = Q.ninvoke(db, "all", "SELECT * FROM tPerson ORDER BY id;");

			var response = {};

			return db_promise.then(function(rows) {
				if (!rows || rows.length == 0) return;

				for (var i = 0; i < rows.length; i++) {
					response[rows[i]["id"]] = rows[i]["name"];
				}

				return response;
			});
		});
};
