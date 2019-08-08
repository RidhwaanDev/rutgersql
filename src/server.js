const express = require('express');
const chalk = require('chalk'); // fun colors for the terminal.
const graphqlHTTP = require('express-graphql');

const schema = require('./schema');
const root = require('./resolvers');

const PORT = 8000;
const log = console.log;

const app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,  // Must be provided
    rootValue: root,
    graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(PORT, () => log(chalk.green(`Now browse to localhost:${PORT}/graphql`)));

