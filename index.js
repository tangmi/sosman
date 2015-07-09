var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);


// TODO:TANG cache this!
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
			var regex = new RegExp(__dirname, 'g');

			res.set('content-type', 'text/plain');
			res.status(500).send(err.message);

			console.log(err.message.replace(regex, ''));
			if (err.codeFrame) {
				console.log(err.codeFrame);
			}
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