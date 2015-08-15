var express = require('express');
var app = module.exports = express();
var fs = require('fs');
var bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});


app.post('/multiapp', function(req, res){
	console.log('request:['+JSON.stringify(req.body)+']');
	var cmd=req.body.cmd;
	var filePath='data/'+cmd+'.txt';
	fs.exists(filePath, function (exists) {
		if(exists){
			var result=fs.readFileSync(filePath);
			console.log('response:['+result+']');
			res.statusCode = 200;
			res.end(result);
		}else{
			console.log('Cannot file file:'+filePath);
		}
	});
});

var port=8000;
if (!module.parent) {
	app.listen(port);
	console.log('server started and listening on port ' + port + ' ...');
} else {
	console.log('server has already been started');
}
