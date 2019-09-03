// this is used for local testing. ( i.e. node server.js )
import app from './src/app';
const port = 1337;

app.listen(
    port,  () =>  console.log('GraphQL Server Running at http://127.0.0.1:' + port )
);

