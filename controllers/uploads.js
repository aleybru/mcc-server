//Controller  Uploads

const { response, request } = require('express');
const { uploadFile } = require('../helpers/uploads');


//const Uploads = require('../models/uploads');

// const getUploads = async (req = request, res = response) => {

// res.json({
// ok: true,
// msg: 'get Api Uploads Controller'
// });
// }

const postUploads = async (req = request, res = response) => {


    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send({
            ok: false,
            msg: 'No existe archivo en la solicitud. - afs'
        });
    }

    if (!req.files.file) {
        return res.status(400).send({
            ok: false,
            msg: 'No existe archivo en la solicitud. - sf'
        });
    }

    try {
        
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const resultUploadedFile = await uploadFile(req.files, validExtensions, 'images');
        res.json( resultUploadedFile );

    } catch (error) {
        return res.status(400).send(error);
    }

    
}

// const putUploads = async (req = request, res = response) => {

// res.json({
// ok: true,
// msg: 'put Api Uploads Controller'
// });
// }

// const patchUploads = (req = request, res = response) => {

// res.json({
// ok: true,
// msg: 'patch Api Uploads Controller'
// });
// }

// const deleteUploads = async (req = request, res = response) => {

// res.json({
// ok: true,
// msg: 'delete Api Uploads Controller'
// });
// }

module.exports = {
    postUploads,
    // getUploads,
    // putUploads,
    // patchUploads,
    // deleteUploads
}