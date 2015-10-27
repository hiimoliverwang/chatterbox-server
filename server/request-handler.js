
var storage = {results:[]};
var allowedUrl = {'/classes/room1':true,"/classes/messages":true};
var fs = require("fs");

module.exports.requestHandler = function(request, response) {


  if (request.url === '/scripts/app.js' || request.url === '/' ){

   fs.readFile('./client/index.html', function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end();
    }
    else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(content);
      response.end();
    }
  });


 } else{
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    console.log("Serving request type " + request.method + " for url " + request.url);
    var statusCode=404;

    if (request.url in allowedUrl && request.method === 'GET'){
      statusCode = 200;
    } else if (request.method ==='POST' ){
      statusCode = 201;
      if (!(request.url in allowedUrl)){
        allowedUrl[request.url] = true;
      }

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
  module.exports.defaultCorsHeaders = defaultCorsHeaders;

}
  var defaultCorsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 // Seconds.
  };


// if (request.url.indexOf('/classes') === -1)