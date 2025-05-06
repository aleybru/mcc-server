//server.js
const express = require('express');
const cors = require('cors');
const httpServer = require('http');
const socketIO = require('socket.io');
const { socketController } = require('../sockets/controllers');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');
const logger = require('../middlewares/logger');
class PrivateServer {
    
    constructor() {
        this.name = 'instance';
        
        this.app = express();
        this.port = process.env.PORT;
        this.server = httpServer.createServer(this.app);
        this.io = socketIO(this.server, {
            cors: {
                origin: "*"
            }
        });
        
        //conectar a BD
        this.conectarDB();
        
        // Middlewares
        this.middlewares();
        
        
        this.sockets();
    }
    
    middlewares() {
        
        // CORS
        this.app.use(cors());
        
        this.app.use(express.json());
        
        this.app.use('/api', require('../routes/index'));
        
        this.app.use(logger);
        
        // Directorio Público
        this.app.use(express.static('public'));
        
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
        }));
    
    }
    
    
    
        async conectarDB() {
        await dbConnection();
    }
    
    sockets() {
        this.io.use((socket, next) => {
            const uid = socket.handshake.auth.uid;
            if (!uid) {
                return next(new Error("invalid user"));
            }
            socket.uid = uid;
            next();
        });
        this.io.on('connection', socketController);
        // this.io.on('connection', connectToWhatsApp);
    }
    
        async listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    
    }
    
}


class Server {

    constructor() {
        throw new Error('Use getInstance method');
    }

    static getInstance() {
        if (!Server.instance) {
            Server.instance = new PrivateServer();
        }
        return Server.instance;
    }
    // this.app = express();
    // this.port = process.env.PORT;
    // this.server = httpServer.createServer(this.app);
    // this.io = socketIO(this.server, {
    //     cors: {
    //         origin: "*"
    //     }
    // });
    // this.paths = {
    //     website: '/',
    //     auth: '/api/auth',
    //     users: '/api/users',
    //     messages: '/api/messages',
    //     filesuploads: '/api/uploads'
    // };
    // constructor() {

    //     this.app = express();
    //     this.port = process.env.PORT;
    //     this.server = httpServer.createServer(this.app);
    //     this.io = socketIO(this.server, {
    //         cors: {
    //             origin: "*"
    //         }
    //     });
    //     this.paths = {
    //         website: '/',
    //         auth: '/api/auth',
    //         users: '/api/users',
    //         messages: '/api/messages',
    //         filesuploads: '/api/uploads'
    //     };


    // //conectar a BD
    // this.conectarDB();

    // // Middlewares
    // this.middlewares();

    // // Rutas de mi aplicación
    // this.routes();


    // this.sockets();


}







module.exports = Server;