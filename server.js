// this is used for local testing. ( i.e. node server.js )
const app = require('./src/app');
const port = 1337;
class Test {
    constructor(name){
        this.name = name;
    }
    print(){
       console.log(this.name);
    }
}

let a = new Test("test");
a.print();

app.listen(
    port,  () =>  console.log('GraphQL Server Running at http://127.0.0.1:' + port )
);

