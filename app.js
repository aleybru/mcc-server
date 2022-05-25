require('dotenv').config();

const Server = require('./models/server');

const server = Server.getInstance();

server.listen();

