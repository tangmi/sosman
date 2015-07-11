import util from 'util';
import fs from 'fs';

import {Timer} from './debug';
import browserify from 'browserify';
import babelify from 'babelify';

import express from 'express';
const app = express();

app.set('port', process.env.PORT || 3000);

// TODO:TANG move this out of the server sub-proj?
const cache = require('./stupid_cache');
function get_browserify_bundle(cb) {
	const f_rebuild_always = process.env.NODE_ENV !== 'production';
	cache('bundle.js', function(cb) {
		const b = browserify('./browser/main.jsx', {
				debug: process.env.NODE_ENV !== 'production',
			})
			.external('react') // TODO:TANG refactor this with vendor.js below
			.external('moment')
			.transform(babelify.configure({
				highlightCode: true, // ansi code output?
			}))
			.bundle()
			.on('error', function(err) {
				cb(err);
			});

		const bufs = [];
		b.on('data', chunk => bufs.push(chunk));
		b.on('end', () => cb(null, Buffer.concat(bufs)));
	}, cb, f_rebuild_always);
}
function get_browserify_vendor(cb) {
	cache('vendor.js', function(cb) {
		const bufs = [];
		browserify()
			.require('react')
			.require('moment')
			.bundle()
			.on('data', chunk => bufs.push(chunk))
			.on('end', () => cb(null, Buffer.concat(bufs)));
	}, cb);
}
if (process.env.NODE_ENV === 'production') {
	// prerender first thing
	get_browserify_bundle(function(err, data) {
		if (err) throw err;
	});
	get_browserify_vendor(function(err, data) {
		if (err) throw err;
	});
}
app.get('/js/bundle.js', function(req, res) {
	get_browserify_bundle(function(err, data) {
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
		res.end(); // needed?
	});
});

app.get('/js/vendor.js', function(req, res) {
	get_browserify_vendor(function(err, data) {
		if(err) throw err;

		res.set('content-type', 'application/javascript');
		res.send(data);
	});
});

app.use(express.static(__dirname + '/static'));

const server = require('http').createServer(app).listen(app.get('port'), function() {
	console.log('listening on ' + server.address().port);
});