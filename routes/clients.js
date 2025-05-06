const { Router } = require('express');
const { check } = require('express-validator');
const {
  createClient,
  getClients,
  getClient,
  updateClient,
  disableClient,
  getMyClient
} = require('../controllers/clients');

const { validateJWT, validateFields } = require('../middlewares');

const router = Router();

router.use(validateJWT);

// 🔸 Crear un nuevo cliente
router.post('/',
  [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('contact_email', 'El email de contacto es obligatorio').isEmail(),
    check('phone', 'El teléfono es obligatorio').notEmpty(),
    validateFields
  ],
  createClient
);
router.get('/my', getMyClient);
// 🔸 Obtener todos los clientes
router.get('/', getClients);

// 🔸 Obtener un cliente específico
router.get('/:id', getClient);

// 🔸 Actualizar cliente
router.put('/:id',
  [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('contact_email', 'El email debe ser válido').isEmail(),
    check('phone', 'El teléfono es obligatorio').notEmpty(),
    validateFields
  ],
  updateClient
);

// 🔸 Desactivar cliente
router.patch('/:id/disable', disableClient);

module.exports = router;
