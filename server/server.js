var restify = require('restify'),
sqlite3 = require('sqlite3'),
fs = require('fs');

var webroot = "client",
port = 8000;

var defaultVersion = "1";

var server = restify.createServer();

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser({ mapParams: false }));

server.get(/^(?!\/rest\/).*/, restify.serveStatic({
	directory: webroot,
	default: 'index.html',
	maxAge: 0
}));

server.get('/rest/hello', function api_hello(req, res, next) {
	res.send("Hello, traveller. VacTrack REST API v" + defaultVersion);
});

server.listen(port);
