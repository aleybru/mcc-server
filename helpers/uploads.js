//Helper  Uploads

const { model } = require('mongoose');
const { response, request } = require('express');
const { Result } = require('express-validator');
const path = require('path');
const { v4:uuidv4} = require('uuid');

const uploadFile = async ( files, validExtensions  = ['txt'], uploadFolder = '') => {

    return new Promise((resolve, reject) => {
        const { file } = files;
        const cutname = file.name.split('.');
        const extension = cutname[cutname.length - 1];

        //validar extension
        
        if (!validExtensions.includes(extension)) {
            return reject({
                 ok: false,
                msg: 'Extensión no válida.'
            });
        }

        const tempName = uuidv4() + '.' + extension;

        const uploadPath = path.join(__dirname, '../uploads/', uploadFolder, tempName);

        // Use the mv() method to place the file somewhere on your server
        file.mv(uploadPath, (err) => {
            if (err) {
                reject({
                    ok: false,
                    msg: err
                });
            }
            resolve({
                ok: true,
                tempName,
                msg: 'post Api Uploads Controller'
            });
    });

    });
}

module.exports = {
    uploadFile,
}