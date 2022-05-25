//Controller  Uploads

const { response, request } = require('express');
const { uploadFile } = require('../helpers/uploads');
const path = require('path');
const fs = require('fs');

const User = require('../models/user');

//update image
const getUploads = async (req = request, res = response) => {
    

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe el usuario con id'
                });
            }
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'No validado'
            });
    }

    if (model.img) {
        // borrar
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) {
            return res.sendFile(pathImg);

        };

    }

    return res.sendFile(path.join(__dirname, '../uploads', '', 'noimage.jpg'));
 
}

const postUploads = async (req = request, res = response) => {


    try {

        const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const resultUploadedFile = await uploadFile(req.files, validExtensions, 'images');
        res.json(resultUploadedFile);

    } catch (error) {

        return res.status(400).send(error);
    }


}

//update image
const putUploads = async (req = request, res = response) => {

    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await User.findById(id);
            if (!model) {
                return res.status(400).json({
                    ok: false,
                    msg: 'No existe el usuario con id'
                });
            }
            break;

        default:
            return res.status(400).json({
                ok: false,
                msg: 'No validado'
            });
    }

    //borrar imagenes anteriores
    if (model.img) {
        // borrar
        const pathImg = path.join(__dirname, '../uploads', collection, model.img);
        if (fs.existsSync(pathImg)) {
            fs.unlinkSync(pathImg);
        }
    }

    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const result = await uploadFile(req.files, validExtensions, collection);
    if (result.ok) {

        model.img = result.filename;
        await model.save();

    } else {
        return res.status(400).json({
            ok: false,
            msg: 'Error al subir archivo'
        });
    }

    res.json({
        ok: true,
        model,
        msg: 'put Api Uploads Controller'
    });
}

module.exports = {
    postUploads,
    putUploads,
    getUploads
}