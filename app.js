
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var request = require('request');
var crawl = require('crawler')


//var crawler = require('./crawler')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


var handler = new htmlparser.DefaultHandler(function (error, dom) {
    if (error)
        console.log("something fucked up"+error);
    else
       console.log("this is dom");
       console.log(dom);

});
var parser = new htmlparser.Parser(handler);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


//app.get('/search', routes.search)
request("https://en.wikipedia.org/wiki/Cave_Story", function(err, resp,body){
	parser.parseComplete(body);

	console.log("ending crawl");


})

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});
