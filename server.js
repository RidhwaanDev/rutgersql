const app = require('./src/app');
const port = 1337;
app.listen(
    port,  () =>  console.log('GraphQL Server Running at http://127.0.0.1:' + port )
);

