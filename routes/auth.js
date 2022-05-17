//AUTH Routes

const { Router } = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, renewUserToken } = require('../controllers/auth');

const { emailExists, userIdExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


//Registro de usuario
router.post('/register', registerUser);

//Login de usuario
router.post('/login',
    [   
        check('username', 'El username no tiene formato de email válido.').normalizeEmail().isEmail(),
        check('password', 'La contraseña es requerida.').notEmpty(),
        validateFields
    ],
    loginUser);

//Validar y revalidar token de usuario
router.get('/renew', renewUserToken);


module.exports = router;