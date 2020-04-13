class SocketAPI {
    constructor(server, port, root){
        server.listen(port , () => {
            console.log('socketio listening o http://127.0.0.1:' + port)
        });
    }
}

module.exports = SocketAPI;


