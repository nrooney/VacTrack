module.exports = function rest_api(options) {
	var db = options.db;
	var server = options.server;

	var default_version = "1";
	var supported_versions = ["1"];

	server.get('/rest/hello', function api_hello(req, res, next) {
		db.all("SELECT $up;",
			   {$up: "Wonkers"},
			   function(err, rows) {
				   var response = {
					   hello: "Hello, traveller. VacTrack REST API",
					   default_version: default_version,
					   supported_versions: supported_versions
				   };

				   if (!err && rows.length === 1) {
					   response.db = rows[0].$up;
				   }

				   res.send(response);

				   return next();
			   });
	});
};
