//AUTH Controller

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');
const VerifyCode = require('../models/verify-code');

const { generateJWT } = require('../helpers/generate-jwt');
const { emailServer } = require('../services/email');

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
        const token = await generateJWT(user.id);
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
   
    const { fullname, username, password, mobile } = req.body;

    const user = new User({ fullname, username, password, mobile });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    const code = uuidv4();

    const verifyCode = new VerifyCode({ code , user });
    await user.save()
        .then((user) => {
            verifyCode.save();
            const email = { 
                to: user.username,
                subject: 'APP - Verificar cuenta',
                code
            }

            emailServer( email );

            res.json({
                ok: true,
                user,
                msg: 'saved'
            });
        }, (error) => {
            res.status(400).json({
                ok: false,
                msg: error.message
            });
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

const verifyUser = async (req = request, res = response) => {

    const { code } = req.params;

    const validCode = await VerifyCode.findOne({ code, isused: false });

    if (!validCode) {
        return res.status(400).json({
            ok: false,
            msg: 'Código no válido.'
        });
    }

    const user = await User.findOneAndUpdate({ _id: validCode.user }, { status: true });

    if (!user) {
        return res.status(400).json({
            ok: false,
            msg: 'Cuenta de usuario no válida. Comuníquese con el administrador.'
        });
    }
    validCode.isused = true;
    await validCode.save();

    res.json({
        ok: true,
        msg: 'Cuenta de usuario activada.'
    });
    try {

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Cuenta de usuario activada.'
        });
    }
}


module.exports = {
    loginUser,
    registerUser,
    renewUserToken,
    verifyUser
}
