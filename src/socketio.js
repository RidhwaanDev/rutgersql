class SocketAPI {
    // root contains all the api endpoints/ resolvers.
    constructor(server, io, port, root, cache){
        // will cache api results 
        this.cache = cache;
        // hash of the last alert
        this.lastAlertsHash = 0;

        server.listen(port , () => {
            console.log('socketio listening  http://127.0.0.1:' + port)
        });
    
        io.on("connection", (socket) => {
          // use this one just to get all the data in one shot. vehiclesByName takes 17s to complete when getting all routes. Needs major rewrite eventually
            setInterval(async () => {
                    const data = await root.routesByName({});
                    socket.emit("data", data);
            }, 1000 * 7);
            // alerts emitted if hash of prev alert is diff
            setInterval(async () => {
                const data = await root.alerts({});
                const responseAsString = data.toString();
                if(responseAsString.hashCode() != this.lastAlertsHash){
                    socket.emit("alerts", data);
                }
        }, 1000 * 7);

            io.on('alerts', async (socket) => {
                setInterval(async () => {
                    const data = await root.alerts();
                    socket.emit("alerts", data);
             }, 1000 * 7);
            });

            io.on('routes', (socket) => {
                setInterval(() => {
                    root.routes()
                        .then((res) =>socket.emit('routes',res))
                        .catch((err) => console.log(err));
                }, 1000);
            });

            io.on('vehicles', (socket) => {
                setInterval(() => {
                    root.vehicles()
                        .then((res) => socket.emit('vehicles', res))
                        .catch((err) => console.log(err));
                }, 1000);
            });

            io.on('stops', (socket) => {
                setInterval(() => {
                    root.stops()
                        .then((res) => socket.emit('stops', res))
                        .catch((err) => console.log(err));
                }, 1000);
            })

        });
    }
}
        
String.prototype.hashCode = function() {
    var hash = 0;
    if (this.length == 0) {
        return hash;
    }
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

module.exports = SocketAPI;
