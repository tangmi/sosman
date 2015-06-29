var express = require('express');
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/static'));
var server = require('http').createServer(app).listen(app.get('port'), function() {
	console.log('listening on ' + server.address().port);
});