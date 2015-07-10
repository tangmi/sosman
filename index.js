var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);


// TODO:TANG cache this on process.env.NODE_ENV === 'production'
var util = require("util");
var fs = require("fs");
var browserify = require('browserify');
var babelify = require("babelify");
app.get('/js/bundle.js', function(req, res) {
	res.set('content-type', 'application/javascript');

	browserify('./browser/main.jsx', {
			debug: true
		})
		.transform(babelify)
		.bundle()
		.on('error', function(err) {
			var regex_dirname = new RegExp(__dirname, 'g');

			console.log(err.message.replace(regex_dirname, ''));
			if (err.codeFrame) {
				console.log(err.codeFrame);
			}

			var msg = util.format(
				'console.error("%s\\n%s");',
				err.message
					.replace(regex_dirname, ''),
				err.codeFrame
					.replace(/\[[0-9]+m/g, '') // remove console color codes (e.g. `[32m`)
					.replace(regex_dirname, '').
					replace(/\r?\n/g, '\\n'));

			res.send(msg);
		})
		.on('end', function() {
			console.log('built ok!');
		})
		.pipe(res);
});

app.use(express.static(__dirname + '/static'));

var server = require('http').createServer(app).listen(app.get('port'), function() {
	console.log('listening on ' + server.address().port);
});