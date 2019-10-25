require('dotenv').config();

const express  = require('express');
const chalk  = require('chalk');
const graphqlHTTP  = require("express-graphql");
const schema  = require('./schema');
const root  = require( './rootresolver');
const heapdump = require('heapdump');
setTimeout(() => {
    heapdump.writeSnapshot(function(err, filename) {
        console.log('dump written to', 'heapdump.heapsnapshot');
    });

}, 5000);
const {queryMapsAPI} = require('./resolvers/directions');
const app = express();
app.use('/', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

module.exports = app;
