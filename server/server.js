var static = require('node-static'),
http = require('http'),
util = require('util');

var webroot = "../client",
port = 8000;

var file = new(static.Server)(webroot, {
	cache: 0
});

function requestHandler(req, res) {
	req.addListener('end', function() {
		file.serve(req, res, function(err, result) {
			if (err) {
				console.error('Error serving %s - %s', req.url, err.message);
				if (err.status === 404 || err.status === 500) {
					file.serveFile(util.format('/%d.html', err.status), err.status, {}, req, res);
				} else {
					res.writeHead(err.status, err.headers);
					res.end();
				}
			} else {
				console.log('%s - %s', req.url, result.message);
			}
		});
	}).resume();
}

var app = http.createServer(requestHandler);

app.listen(port);
