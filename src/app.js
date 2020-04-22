require('dotenv').config();
const memwatch = require('node-memwatch');
const express  = require('express');
const graphqlHTTP  = require("express-graphql"); // graphql server
const schema  = require('./schema');
const root  = require( './rootresolver');
const app = express();
const SocketAPI = require('./socketio');
const http = require('http').Server(express); // socket.io server
const io = require('socket.io')(http);

// // this port is used for socket.io testing
const port = 3000;
const socket = new SocketAPI(http,io, port, root);

app.use('/', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

// if heap usage increases after five garbage collections then we probably have a leak.
memwatch.on('leak', (info) => {
    console.log(info);
});

// called on every GC
memwatch.on('stats', (stats) => {
    console.log(stats);
 });


module.exports = app;
