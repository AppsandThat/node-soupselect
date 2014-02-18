var select = require('./lib/soupselect').select,
    htmlparser = require("htmlparser"),
    http = require('http'),
    sys = require('sys');

// fetch some HTML...
var http = require('http');
var HOST = 'en.wikipedia.org';
//Test variable for link recursion
var start_path = '/wiki/Main_Page'

var article_links = [];
saveLinks = function(links) {
    article_links = links;
    //sys.puts(article_links);

}

function getLinks (path) {
    var link_arr = [];

    var req_options = {
        host: 'en.wikipedia.org',
        port: '80',
        path: path,
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
                    
                    //sys.puts("Links in wikipedia article");
                   
                    var cnt = 0;
                    links.forEach(function(link) {
                        if(link_regex.test(link.attribs.href) && link.attribs != path){
                            cnt ++;
                            link_arr[cnt] = link.attribs.href;
                            console.log("the count is "+"- [" + link_arr[cnt] +"]\n");//link.attribs.href + "]\n");
                        }
                        
                    })
                }  
    
            });

            var parser = new htmlparser.Parser(handler);
            parser.parseComplete(body);
        });


    });
    request.end();
  
}
/*
//TODO: Make this inteface with app.js (to display the results on a webpage)
exports.recurLinks = function (num_recur, start_path) {

}
*/

//console.log(getLinks(start_path));
/*
for (var i=0; i< article_links.length; i++) {
    sys.puts(i+"a");
    sys.puts(article_links[i]);
}*/
