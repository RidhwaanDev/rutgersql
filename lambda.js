// lambda function handler
const awsExpress = require('aws-serverless-express');
const app = require('./src/app');
const server = awsExpress.createServer(app);
exports.handler = (event, context) => {
    // send lambda to our graphql server
    awsExpress.proxy(server, event, context);
};


