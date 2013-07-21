var restify = require('restify'),
sqlite3 = require('sqlite3'),
fs = require('fs');

var webroot = "client",
port = 8000;

var defaultVersion = "1";
var db_file = "./vactrack.db"
var db;

if (!fs.existsSync(db_file)) {
	console.log("No db! Create " + db_file);
	// TODO: create a quicksetup for the sqlite file
	process.exit(1);
}

// afaict, C++ destructor for Database closes sqlite handles.
// What are Node's guarantees on calling those...?
// Attempting to call close() in SIGINT seems to restart the event loop
db = new sqlite3.Database(db_file, function(error) {
	if (!error) {
		start_server();
	} // TODO: Meaningful error goes here
});

function start_server() {
	var server = restify.createServer();

	server.use(restify.acceptParser(server.acceptable));
	server.use(restify.queryParser({ mapParams: false }));

	server.get(/^(?!\/rest\/).*/, restify.serveStatic({
		directory: webroot,
	default: 'index.html',
		maxAge: 0
	}));

	server.get('/rest/hello', function api_hello(req, res, next) {
		db.all("SELECT 1;", function(err, rows) {
			var hello_msg = "Hello, traveller. VacTrack REST API v" + defaultVersion;

			if (!err && rows.length === 1) {
				hello_msg += " - DB IS UP.";
				console.log(JSON.stringify(rows));
			}

			res.send(hello_msg);

			return next();
		});

	});

	server.listen(port);
}
