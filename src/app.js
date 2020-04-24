require('dotenv').config();
const memwatch = require('@airbnb/node-memwatch');
const express  = require('express');
const graphqlHTTP  = require("express-graphql"); // graphql server
const schema  = require('./schema');
const root  = require( './rootresolver');
const app = express();
const http = require('http').Server(express); // socket.io server
const io = require('socket.io')(http);

// Wrapper class for socket.io
const SocketAPI = require('./socketio');


// // this port is used for socket.io testing
const port = 3000;
const socket = new SocketAPI(http,io, port, root);

app.use('/', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

// if heap usage increases after five garbage collections then we probably have a leak.
// for our purposes this should be all we need in terms of memory profiling. As long as there is no growing leaks, we should be good to go.
memwatch.on('leak', (info) => {
    for(let i = 0; i < 20; i++){
        console.log("OH GOD THERE HAS BEEN A LEAK");
    }
    console.log(info);
});

// called on every GC event
memwatch.on('stats', (stats) => {
    console.log(stats);
 });


module.exports = app;
