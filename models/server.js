const express = require('express');
const cors = require('cors');
const httpServer = require('http');
const socketIO = require('socket.io');
const { socketController, connectToWhatsApp } = require('../sockets/controllers');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');



class Server {
    
    constructor() {
        
        this.app = express();
        this.port = process.env.PORT;
        this.server = httpServer.createServer(this.app);
        this.io = socketIO(this.server, {
            cors: {
                origin: "*"
            }
        });
        this.paths = {
            website: '/',
            auth: '/api/auth',
            users: '/api/users',
            messages: '/api/messages',
            filesuploads: '/api/uploads'
        };
        
       
        //conectar a BD
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();


        this.sockets();

       
    }


    middlewares() {

        // CORS
        this.app.use(cors());

        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static('public'));

        this.app.use( fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true
          }));

    }

    routes() {
        
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.users, require('../routes/users'));
        this.app.use(this.paths.messages, require('../routes/messages'));
        this.app.use(this.paths.filesuploads, require('../routes/uploads'));
        this.app.use(this.paths.website, require('../routes/website'));

    }

    async conectarDB() {
        await dbConnection();
    }

    sockets() {
        this.io.on('connection', socketController);
        // this.io.on('connection', connectToWhatsApp);
    }

    async listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });

    }
}




module.exports = Server;