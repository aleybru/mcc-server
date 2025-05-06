const { Router } = require('express');
const { check } = require('express-validator');
const { createDevice, getDevicesByClient, deactivateDevice } = require('../controllers/devices');
const { validateJWT, validateFields } = require('../middlewares');

const router = Router();

router.use(validateJWT);

// 🔸 Registrar dispositivo
router.post('/',
  [
    check('name', 'El nombre es obligatorio').notEmpty(),
    check('phone', 'El teléfono es obligatorio').notEmpty(),
    check('client', 'El cliente es obligatorio').isMongoId(),
    validateFields
  ],
  createDevice
);

// 🔸 Listar dispositivos por cliente
router.get('/:clientId', getDevicesByClient);

// 🔸 Desactivar dispositivo
router.patch('/:id/deactivate', deactivateDevice);

module.exports = router;
