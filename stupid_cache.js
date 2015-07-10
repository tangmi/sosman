var cache = {};

module.exports = function(key, fn, cb) {
	if(typeof cache[key] === 'undefined' || process.env.NODE_ENV !== 'production') {
		if(typeof fn !== 'function') {
			cb(new Error('key not found in cache and no setter fn defined'));
		} else {
			fn(function(err, val) {
				if(err) return cb(err);
				cache[key] = val;
				cb(null, cache[key]);
			});
		}
	} else {
		cb(null, cache[key]);
	}
}
