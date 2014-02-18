var select = require('./lib/soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    sys = require('sys');

// fetch some HTML...
var http = require('http');
var HOST = 'en.wikipedia.org';

var req_options = {
    host: HOST,
    port: '80',
    path: '/wiki/Main_Page',
    method:'GET'
}

var request = http.request(req_options, function(response){
    response.setEncoding('utf8');
    
    var body = "";
    response.on('data', function (chunk) {
        body = body + chunk;
    });
    
    //Evalutes true for only links that look like '/wiki/blablah1234blah'
    link_regex = new RegExp("^/wiki/[A-Za-z0-9]*")

    response.on('end', function() {
        
        // now we have the whole body, parse it and select the nodes we want...
        var handler = new htmlparser.DefaultHandler(function(err, dom) {
            if (err) {
                sys.debug("Error: " + err);
            } else {
                
                // soupselect happening here...
                var links = select(dom, 'a');
                
                sys.puts("Links in wikipedia article");
               
                links.forEach(function(link) {
                    if(link_regex.test(link.attribs.href)){
                        sys.puts("- [" + link.attribs.href + "]\n");
                    }
                })
            }
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(body);
    });


});

request.end();