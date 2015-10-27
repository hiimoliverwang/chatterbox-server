/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var storage = {results:[]};
var allowedUrl = {'/classes/room1':true,"/classes/messages":true};
module.exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";
  console.log("Serving request type " + request.method + " for url " + request.url);
  var statusCode=404;

    if (request.url in allowedUrl && request.method === 'GET'){
      statusCode = 200;
    } else if (request.method ==='POST' ){
      statusCode = 201;

      request.on('data', function(d){
        var data = '';
        data+=d;
        request.on('end',function(d){
          storage.results.push(JSON.parse(data));
        });
      });
    }
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(storage));
}
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
module.exports.defaultCorsHeaders = defaultCorsHeaders;
// module.exports.requestHandler = requestHandler;
