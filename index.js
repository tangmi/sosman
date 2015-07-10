var util = require("util");
var fs = require("fs");

var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);

function get_browserify_output(cb) {
	var cache = require('./stupid_cache');
	
	function DbgTimer() {
		var start = +new Date;
		this.stop = function() {
			return (+new Date) - start;
		}
	}

	if(typeof cb !== 'function') {
		cb = function(err, data) {};
	}

	var t = new DbgTimer();
	cache('browserify_output', function(cb) {
		var b = require('browserify')('./browser/main.jsx', {
				debug: true
			})
			.transform(require("babelify"))
			.bundle();
		
		b.on('error', function(err) {
			cb(err);
		});

		var bufs = [];
		b.on('data', function(chunk) {
			bufs.push(chunk);
		});
		b.on('end', function() {
			cb(null, Buffer.concat(bufs));
			console.log('build ok, %ss', t.stop() / 1000);
		});
	}, cb);
}
if(process.env.NODE_ENV === 'production') {
	// prerender first thing
	get_browserify_output();
}
app.get('/js/bundle.js', function(req, res) {
	res.set('content-type', 'application/javascript');

	get_browserify_output(function(err, data) {
		if(err) {
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
					.replace(regex_dirname, '')
					.replace(/\r?\n/g, '\\n'));

			return res.send(msg);
		}

		res.send(data);
	});
});

app.use(express.static(__dirname + '/static'));

var server = require('http').createServer(app).listen(app.get('port'), function() {
	console.log('listening on ' + server.address().port);
});
