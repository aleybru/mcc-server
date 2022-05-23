//middleware  Validate JWT

const { response, request } = require('express');
const jwt = require("jsonwebtoken");
const User = require('../models/user');

const validateJWT = async (req, res, next) => {

    try {
    const token = req.header('x-token');

    if (!token) {
        return res.status(400).json({
            msg: 'No existe token'
        });
    }


        const { uid } = jwt.verify(token, process.env.SECRETEJWTKEY);
        const userloged = await User.findById(uid);
       

        if (!userloged) {
            return res.status(401).json({
                msg: 'Usuario no existe'
            });
        }
        if (!userloged.status) {
            return res.status(401).json({
                msg: 'Usuario deshabilitado'
            });
        }
        req.user = userloged;

        next();
    } catch (error) {
        //console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }



}


module.exports = {
    validateJWT
}