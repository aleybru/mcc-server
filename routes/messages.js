const { Router } = require('express');
const { check } = require('express-validator');
const { validateFields, validateJWT } = require('../middlewares');

const { 
    getMessages, 
    getMessage, 
    postMessages 
} = require('../controllers/messages');


const router = Router();

// 🔐 Middleware de autenticación para todas las rutas
router.use(validateJWT);

// 📩 Obtener todos los mensajes del usuario autenticado
router.get('/', getMessages);

// 📨 Obtener un mensaje específico por ID
router.get('/:id', getMessage);

// ✉️ Enviar un nuevo mensaje
router.post('/', postMessages
);

module.exports = router;
