class Memwatch {
     apiStats = {
        functionName : "",
        mbUsage : 0,
    };

    constructor(memwatch){
        this.memwatch = memwatch;
    }

    memoryUsageOfServer(){
        // memory usage of the entire server
    }

    memoryUsageOfAPIEndpoint(apiEndpoint){
        //analyze the overall memory usage of a single endpoint
        // do a simple heapdiff
        const hd = new this.memwatch.HeapDiff();
        apiEndpoint();
        const diff = hd.end();
        console.log(`${apiEndpoint.name} : ${diff} `);
    }
    
    memoryLeaksOfAPIEndpoint(apiEndpoint){
       //analyze memory leaks for a single endpoint
       // keep calling the endpoint until v8 calls emits 'leak' event
       const interval = 3000;
       const id =  setInterval(() => {
            apiEndpoint(); 
        }, interval);

        memwatch.on('leak', (info) => {
            clearInterval(id);
            console.log(info);
        });

    }
}
