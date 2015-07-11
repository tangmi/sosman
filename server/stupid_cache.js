const cache = {};

export default function(key, fn, cb, f_rebuild_always) {
	if (f_rebuild_always || typeof cache[key] === 'undefined') {
		if (typeof fn !== 'function') {
			cb(new Error('key not found in cache and no setter fn defined'));
		} else {
			fn(function(err, val) {
				if (err) return cb(err);
				cache[key] = val;
				cb(null, cache[key]);
			});
		}
	} else {
		cb(null, cache[key]);
	}
}