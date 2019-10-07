require('dotenv').config();

const express  = require('express');
const chalk  = require('chalk');
const graphqlHTTP  = require("express-graphql");
const schema  = require('./schema');
const root  = require( './rootresolver');
const {Graph} = require('./structures/graph');
const {GNode} = require('./structures/graph');
const globalcache = require('./structures/cache');

globalcache.myCache.on("set",(key,value) => {
    console.log(`${key} : ${value}`);
});

const test = new Graph();

const stop_a = "SAC";
const stop_b = "CASC";
const stop_c = "SCOTT HALL";

test.addEdge(stop_a,stop_b,10);
test.addEdge(stop_b,stop_c,5);

console.log(test.stringify());


const app = express();
app.use('/', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

module.exports = app;
