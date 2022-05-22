//Routes  Uploads
const { Router } = require('express');
const { check } = require('express-validator');

const { postUploads } = require('../controllers/uploads');

const router = Router();

// list all Uploads
// router.get('/', getUploads);

//create Uploads
router.post('/', postUploads);

//update Uploads
// router.put('/:id', putUploads);

//update Uploads
// router.patch('/', patchUploads);

//delete Uploads
// router.delete('/:id', deleteUploads);

module.exports = router;