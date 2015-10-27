
var storage = {results:[
  {
    username:'Oliver',
    text:'Hi, I"m oliver',
    objectId:'alsakdjfalskdfjha'
  },{
    username:'Oliver',
    text:'Hi, I"m oliver',
    objectId:'alskdjgfalskdfjha'
  },{
    username:'Oliver',
    text:'Hi, I"m oliver',
    objectId:'alskdjsfalskdfjha'
  },{
    username:'Oliver',
    text:'Hi, I"m oliver',
    objectId:'alskhdjfalskdfjha'
  },

  ]};
var currObjId = 0;
var allowedUrl = {'/classes/room1':true,
"/classes/messages":true,
"/?username=":true
};
var fs = require("fs");
var ASSets = {
  '/scripts/app.js':['../client/index.html','text/html'],
  '/':['../client/index.html','text/html'],
  '/favicon.ico':['../client/index.html','text/html'],
  '/scripts/refactor.js':['../client/scripts/refactor.js','text/javascript'],
  '/images/spiffygif_46x46.gif':['../client/images/spiffygif_46x46.gif','text/html'],
  '/styles/styles.css':['../client/styles/styles.css','text/css'],
  '/env/config.js':['../client/env/config.js','text/javascript']



}

module.exports.requestHandler = function(request, response) {

    console.log("Serving request type " + request.method + " for url " + request.url);


  if (request.url.slice(0,11) ==="/?username="){
    request.url = '/';
  }

  if (request.url in ASSets ) {

   fs.readFile(ASSets[request.url][0], function(error, content) {
    if (error) {
      console.log(error);
      response.writeHead(500);
      response.end();
    }
    else {
      response.writeHead(200, { 'Content-Type': ASSets[request.url][1]});
      response.write(content);
      response.end();
    }
  });
 } else{
    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
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
          var parsedData = JSON.parse(data);
          parsedData.objectId = currObjId++;
          console.log(parsedData);
          storage.results.push(parsedData);
          console.log(storage);
        });
      });
    }

    if (statusCode === 404) {
      response.end('404 error!!!');
    }
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(storage));
  }

}



  var defaultCorsHeaders = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10 // Seconds.
  };


// if (request.url.indexOf('/classes') === -1)