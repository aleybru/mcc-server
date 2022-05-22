//AUTH Controller

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const User = require('../models/user');
const VerifyCode = require('../models/verify-code');

const { generateJWT } = require('../helpers/generate-jwt');
const { emailServer } = require('../services/email');
const EmailFactory = require('../models/emails/email-factory');

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

    const verifyCode = new VerifyCode({ code, user });
    await user.save()
        .then((user) => {
            verifyCode.save();
            const data = {
                user,
                code,
                type: 'verify'
            }
            const tpl = new EmailFactory(data);

            emailServer(tpl.data.email);

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
    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT(uid);

    const users = await User.findById(uid);
    res.json({
        ok: true,
        token,
        users,
        msg: 'get Api USER Controller'
    });
}

const verifyUser = async (req = request, res = response) => {

    try {

        const { code } = req.params;

        const validCode = await VerifyCode.findOne({ code, isused: false, type: 'VERIFY' });

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


    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Cuenta de usuario activada.'
        });
    }
}

const resetPassword = async (req = request, res = response) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username, status: true });

        if (!user) {
            return res.status(400).json({
                ok: false,
                msg: 'Cuenta de usuario no válida. Comuníquese con el administrador.'
            });
        }

        const code = uuidv4();
        const verifyCode = new VerifyCode({ code, user, type: 'RESET' });

        await verifyCode.save()
            .then(() => {
                console.log('-->', user);

                const data = {
                    user,
                    code,
                    type: 'reset'
                }
                const tpl = new EmailFactory(data);

                emailServer(tpl.data.email);

                res.json({
                    ok: true,
                    msg: 'Solicitud de cambio de contraseña realizada.'
                });
            }, (error) => {
                res.status(400).json({
                    ok: false,
                    msg: error.message
                });
            });




    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error general - reqchgpwd'
        });
    }
}

const changePassword = async (req = request, res = response) => {

    try {


        const { code, password } = req.body;

        const validCode = await VerifyCode.findOne({ code, isused: false, type: 'RESET' });

        // console.log(code + password);
        if (!validCode) {
            return res.status(400).json({
                ok: false,
                msg: 'Código no válido.'
            });
        }

        const salt = bcryptjs.genSaltSync();
        const pwd = bcryptjs.hashSync(password, salt)

        const result = await User.findOneAndUpdate({ _id: validCode.user }, { password: pwd });

        if (result) {

            validCode.isused = true;
            await validCode.save();
        } else {
            return res.status(400).json({
                ok: false,
                msg: 'Error al procesar el cambio de contraseña.'
            });
        }

        res.json({
            ok: true,
            msg: 'Contraseña cambiada.'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error general - chgpwd.'
        });
    }
}


module.exports = {
    loginUser,
    registerUser,
    renewUserToken,
    verifyUser,
    resetPassword,
    changePassword
}
