// this is the lambda function that AWS uses. The function simply proxies/sends it to an express server where graphql stuff happens
const awsExpress = require('aws-serverless-express');
const app = require('./src/app');
const server = awsExpress.createServer(app);
module.exports.query = (event, context) => {
    // send lambda to our express server
    awsExpress.proxy(server, event, context);
};
