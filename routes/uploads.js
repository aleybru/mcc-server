//Routes  Uploads
const { Router } = require('express');
const { check } = require('express-validator');

const { postUploads, putUploads } = require('../controllers/uploads');

const { validateFields, validateUpload } = require('../middlewares');
const { allowedCollections } = require('../helpers');

const router = Router();

// list all Uploads
// router.get('/', getUploads);

//create Uploads
router.post('/', validateUpload, postUploads);

//update Uploads
 router.put('/:collection/:id',
    [
        validateUpload,
        check('id', 'El id no es válido ').isMongoId(),
        check('collection').custom( c => allowedCollections( c, ['users'])),
        validateFields
    ],
     putUploads);

//update Uploads
// router.patch('/', patchUploads);

//delete Uploads
// router.delete('/:id', deleteUploads);

module.exports = router;