// lambda function handler
const awsExpress = require('aws-serverless-express');
const app = require('./src/app');
const server = awsExpress.createServer(app);
exports.handler = (event, context) => {
    awsExpress.proxy(server, event, context);
    // return JSON.stringify(`here is the event object for you ${JSON.stringify(event)}`);
};


