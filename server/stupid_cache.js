const cache = {};

import util from 'util';
import {Timer} from './debug';

export default function(key, fn, cb, f_rebuild_always) {
	if (f_rebuild_always || typeof cache[key] === 'undefined') {
		if (typeof fn !== 'function') {
			cb(new Error('key not found in cache and no setter fn defined'));
		} else {
			const t = new Timer();
			fn(function(err, val) {
				if (err) return cb(err);
				cache[key] = val;
				util.log('cache["%s"] evaluated, took %ss', key, t.elapsed() / 1000);
				cb(null, cache[key]);
			});
		}
	} else {
		cb(null, cache[key]);
	}
}