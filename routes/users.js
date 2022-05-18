//Users Routes

const { Router } = require('express');
const { check } = require('express-validator');

const { emailExists, userIdExists, isValidRole } = require('../helpers/db-validators');

const { validateFields, validateJWT, validateRoles, hasRole } = require('../middlewares');

const { getUsers, postUsers, putUsers, patchUsers, deleteUsers } = require('../controllers/users');

const router = Router();

//Listar usuarios
router.get('/', validateJWT, getUsers);

//crear usuarios
router.post('/',
    [
        validateJWT,
        check('fullname', 'El fullname es requerido.').not().isEmpty().trim().escape(),
        check('username', 'El username no tiene formato de email válido.').normalizeEmail().isEmail(),
        check('username').custom(emailExists),
        check('mobile', 'El teléfono móvil es requerido.').not().isEmpty().trim().escape(),
        check('password', 'La contraseña debe tener 8 o más caracteres y al menos 1 número.')
            .isLength({ min: 8 })
            .withMessage('Debe tener al menos 8 caracteres.')
            .matches(/\d/)
            .withMessage('Debe contener al menos 1 número.'),
        check('role').custom(isValidRole),
        validateFields
    ]
    , postUsers);

//modificar usuarios
router.put('/:id',
    [
        validateJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(userIdExists),
        check('username').custom(emailExists),
        validateFields
    ], 
    putUsers);

//actualizar usuarios
router.patch('/', patchUsers);

//eliminar usuarios
router.delete('/:id',
    [
        validateJWT,
        hasRole('ADMIN'),
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom(userIdExists),
        validateFields
    ],
    deleteUsers);

module.exports = router;