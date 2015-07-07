var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);



var util = require('util');
var browserify = require('browserify');
app.get('/js/bundle.js', function(req, res) {
	res.set('content-type', 'application/javascript');
	var b = browserify({
		debug: true,
	});
	b.add('./browser/main.js');
	b.bundle()
		.on('error', function(err) {
			res.set('content-type', 'text/plain');
			res.status(500).send(err.message + '\n\n' + err.stack);
		})
		.pipe(res);
});

app.use(express.static(__dirname + '/static'));

var server = require('http').createServer(app).listen(app.get('port'), function() {
	console.log('listening on ' + server.address().port);
});