var Q = require("q"),
restify = require("restify");

module.exports = function rest_api(options) {
	var db = options.db;
	var server = options.server;

	var default_version = "1";
	var supported_versions = ["1"];
	// Maximum Events sent back in group
	var total_events_limit = 50;

	//TODO: document these things
	function map_route(endpoint, http_method, callback_fun) {
		var wrapped_callback = function wrapped_callback(req, res, next) {
			Q.try(callback_fun, req, res)
				.catch(function global_error(error) {
					return next(error);
				}).done(function global_done(value) {
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

	map_route("/rest/hello", "get", function api_hello(req, res) {
		var response = {
			hello: "Hello, traveller. VacTrack REST API",
			default_version: default_version,
			supported_versions: supported_versions
		};

		var db_promise = Q.ninvoke(db, "all", "SELECT 1;").then(function(rows) {
			if (rows && rows.length === 1) {
				response.db = "1";
			}
		}).finally(function() {
			res.send(response);
		});

		return db_promise;
	});

	map_route("/rest/events", "get", function get_events(req, res) {
		var event_offset = 0;
		//TODO: Shared parameter handling
		if (req.query.offset) {
			var offset = parseInt(req.query.offset, 10);
			if (isNaN(offset) || offset < 0) {
				throw new restify.InvalidArgumentError("Is that really a valid offset? Honestly?");
			} else {
				event_offset = req.query.offset;
			}
		}

		var db_promise = Q.ninvoke(db, "all", "SELECT * FROM tEvent ORDER BY id LIMIT $total_events OFFSET $event_offset;",
								  {$total_events: total_events_limit, $event_offset: event_offset});

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
		}).finally(function() {
			res.send(response);
		});
	});

	map_route("/rest/people", "get", function get_people(req, res) {
		//TODO: Offsets?

		var db_promise = Q.ninvoke(db, "all", "SELECT * FROM tPerson ORDER BY id;");

		var response = {};

		//TODO: Share some DB setup/return?
		return db_promise.then(function(rows) {
			if (!rows || rows.length == 0) return;

			for (var i = 0; i < rows.length; i++) {
				response[rows[i]["id"]] = rows[i]["name"];
			}

			return;
		}).finally(function() {
			res.send(response);
		});
	});
};
