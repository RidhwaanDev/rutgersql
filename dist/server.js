"use strict";

// this is used for local testing. ( i.e. node server.js )
var app = require('./src/app');

port = 1337;
app.listen(port, function () {
  return console.log('GraphQL Server Running at http://127.0.0.1:' + port);
});