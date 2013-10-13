"use strict";

var restify = require("restify"),
sqlite3 = require("sqlite3"),
fs = require("fs");

var webroot = "client",
port = 8000;

var db_file = "./vactrack.db"

//TODO: Localisation? Maybe L20n?
if (!fs.existsSync(db_file)) {
	console.log("No db! Create by executing \"sqlite3 -init server/vactrack.sql " + db_file + " '.exit'\"");
	console.log("Dummy data is available in server/test.sql");
	process.exit(1);
}

// afaict, C++ destructor for Database closes sqlite handles.
// What are Node's guarantees on calling those...?
// Attempting to call close() in SIGINT seems to restart the event loop
var db = new sqlite3.Database(db_file, function(open_error) {
	if (!open_error) {
		db.exec("PRAGMA foreign_keys = ON;", function (init_error) {
			if (!init_error) start_server();
		});
	} // TODO: Meaningful error messages
});

function start_server() {
	var server = restify.createServer();

	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser({ mapParams: true }));
	server.use(restify.bodyParser({ mapParams: true }));
	// TODO: Caching/gzip/Etag

	server.get(/^(?!\/rest\/).*/, restify.serveStatic({
		directory: webroot,
		default: "index.html",
		maxAge: 0
	}));

	require("./api")({
		db: db,
		server: server
	});

	server.listen(port);
}
