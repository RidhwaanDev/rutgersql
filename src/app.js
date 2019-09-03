import express from 'express'
import chalk from 'chalk'
import graphqlHTTP from "express-graphql";
import schema from './schema'
import root from './resolvers'
import cache from './cache'

const log = console.log;
export const app = express();
app.use('/', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

export default app;



