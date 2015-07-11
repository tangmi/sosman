import util from 'util';
import fs from 'fs';

import {Timer} from './debug';
import browserify from 'browserify';
import babelify from 'babelify';

import express from 'express';
const app = express();

app.set('port', process.env.PORT || 3000);

function get_browserify_output(cb) {
	const cache = require('./stupid_cache');

	if (typeof cb !== 'function') {
		cb = function(err, data) {};
	}

	const t = new Timer();
	cache('browserify_output', function(cb) {
		const b = browserify('./browser/main.jsx', {
				debug: true
			})
			.transform(babelify)
			.bundle()
			.on('error', function(err) {
				cb(err);
			});

		const bufs = [];
		b.on('data', chunk => bufs.push(chunk));
		b.on('end', () => {
			cb(null, Buffer.concat(bufs));
			console.log('build ok, %ss', t.elapsed() / 1000);
		});
	}, cb);
}
if (process.env.NODE_ENV === 'production') {
	// prerender first thing
	get_browserify_output(function(err, data) {
		if (err) throw err;
	});
}
app.get('/js/bundle.js', function(req, res) {
	get_browserify_output(function(err, data) {
		if (err) {
			const regex_dirname = new RegExp(__dirname, 'g');

			console.log(err.message.replace(regex_dirname, ''));
			console.log(err.codeFrame.replace(regex_dirname, ''));

			const msg_fmt = err.message
				.replace(regex_dirname, '')
				.replace(/'/g, '\\\'');
			const codeFrame_fmt = err.codeFrame
				.replace(/\[[0-9]+m/g, '') // remove console color codes (e.g. `[32m`)
				.replace(regex_dirname, '')
				.replace(/\r?\n/g, '\\n')
				.replace(/'/g, '\\\'');

			res.set('content-type', 'application/javascript');
			res.send(`console.error('${msg_fmt}\\n${codeFrame_fmt}');`);
		} else {
			res.set('content-type', 'application/javascript');
			res.send(data);
		}
		res.end();
	});
});

app.use(express.static(__dirname + '/static'));

const server = require('http').createServer(app).listen(app.get('port'), function() {
	console.log('listening on ' + server.address().port);
});