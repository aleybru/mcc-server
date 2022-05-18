//AUTH Routes

const { Router } = require('express');
const { check } = require('express-validator');
const { registerUser, loginUser, renewUserToken, verifyUser } = require('../controllers/auth');

const { emailExists, userIdExists } = require('../helpers/db-validators');
const { validateFields } = require('../middlewares/validate-fields');
// const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();


//Registro de usuario
router.post('/register', [
    check('fullname', 'El fullname es requerido.').not().isEmpty().trim().escape(),
    check('username', 'El username no tiene formato de email válido.').normalizeEmail().isEmail(),
    check('username').custom( emailExists ),
    check('mobile', 'El teléfono móvil es requerido.').not().isEmpty().trim().escape(),
    check('password', 'La contraseña debe tener 8 o más caracteres y al menos 1 número.')
        .isLength({ min: 8 })
        .withMessage('Debe tener al menos 8 caracteres.')
        .matches(/\d/)
        .withMessage('Debe contener al menos 1 número.'),
    validateFields
],
    registerUser);

//Login de usuario
router.post('/login',
    [
        check('username', 'El username no tiene formato de email válido.').normalizeEmail().isEmail(),
        check('password', 'La contraseña es requerida.').notEmpty(),
        validateFields
    ],
    loginUser);

//Login de usuario
router.get('/verify/:code',
    [
        check('code', 'El código de verificación es requerido.').notEmpty(),
        validateFields
    ],
    verifyUser);

//Validar y revalidar token de usuario
router.get('/renew', renewUserToken);


module.exports = router;