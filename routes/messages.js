//Routes  Messages
const { Router } = require('express');
const { check } = require('express-validator');

const { validateJWT, validateFields } = require('../middlewares');
const { messageIdExists } = require('../helpers/db-validators');

const { getMessage, getMessages, postMessages } = require('../controllers/messages');

const router = Router();

// list all Messages
router.get('/', validateJWT, getMessages);

// list all Messages
router.get('/:id',
    [
        validateJWT,
        check('id', 'No es un id válido').isMongoId(),
        check('id').custom( messageIdExists ),
        validateFields
    ],
    getMessage);

//create Messages
router.post('/',
    [
        validateJWT,
        check('recipient', 'El destinatario es requerido.').not().isEmpty().trim().escape(),
        check('subject', 'El Asunto es requerido.').not().isEmpty().trim().escape(),
        check('body', 'El mensaje no tiene contenido.').not().isEmpty().trim().escape(),
        check('type', 'El tipo de mensaje es requerido.').isIn(['WHATSAPP', 'SMS']),
        validateFields
    ],
    postMessages);

//update Messages
//router.put('/:id', putMessages);

//update Messages
//router.patch('/', patchMessages);

//delete Messages
//router.delete('/:id', deleteMessages);

module.exports = router;