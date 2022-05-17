//AUTH Controller

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');

const loginUser = async (req = request, res = response) => {
    try {
        const { username, password } = req.body;

        //verificar username activo
        const user = await User.findOne({ username, status: true });
        
        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario/contraseña no válidos.'
            });
        } else {
            //verificar contraseña
            const validPassword = bcryptjs.compareSync(password, user.password);
            if (!validPassword) {
                return res.status(400).json({
                    ok: false,
                msg: 'Usuario/contraseña no válidos.'
                });
            }
        }
        // generar Jason Web Token - JWT
        const token = await generateJWT( user.id );
        res.json({
            ok: true,
            user,
            token,
            msg: 'login'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado.'
        });
    }

}
const registerUser = async (req = request, res = response) => {

    const users = await User.find();

    res.json({
        ok: true,
        users,
        msg: 'get Api USER Controller'
    });
}
const renewUserToken = async (req = request, res = response) => {

    const users = await User.find();

    res.json({
        ok: true,
        users,
        msg: 'get Api USER Controller'
    });
}


module.exports = {
    loginUser,
    registerUser,
    renewUserToken
}
