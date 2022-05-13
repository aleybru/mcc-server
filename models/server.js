const express = require('express');
const cors = require('cors');
const httpServer = require('http');
const socketIO = require('socket.io');
const { socketController } = require('../sockets/controllers');

// const app = require('express')();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// io.on('connection', () => { /* … */ });
// server.listen(3000);

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = httpServer.createServer(this.app);
        this.io = socketIO(this.server);
        this.paths = {};


        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        
        this.sockets();
    }



    middlewares() {

        // CORS
        this.app.use( cors() );

        // Directorio Público
        this.app.use( express.static('public') );


    }

    routes() {
        
        // this.app.use( this.paths.auth, require('../routes/auth'));
        
    }

    sockets(){
        this.io.on( 'connection', socketController );
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;