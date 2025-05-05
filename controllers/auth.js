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
        res.status(200).json({
            user: {
              uid: user.id,
              fullname: user.fullname,
              username: user.username,
              role: user.role
            },
            token
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

    const exists = await User.findOne({ username });
    if (exists) {
    return res.status(400).json({ ok: false, msg: 'Ese usuario ya existe.' });
    }


    const user = new User({ fullname, username, password, mobile });

    const code = uuidv4();

    const verifyCode = new VerifyCode({ code, user, type: 'VERIFY' });
    await user.save()
        .then(async (user) => {
            await verifyCode.save();
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
    const uid = req.user._id;
    // Generar el TOKEN - JWT
    const token = await generateJWT(uid);

    const user = await User.findById(uid);
    res.json({
        ok: true,
        token,
        user,
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
            msg: `Error general - chgpwd: ${error.message}`

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
        const user = await User.findById(validCode.user);
        user.password = password; // middleware hace el hash

        const saved = await user.save();

        if (saved) {
          validCode.isused = true;
          await validCode.save();
          res.json({
            ok: true,
            msg: 'Contraseña cambiada.'
          });
        } else {
          return res.status(400).json({
            ok: false,
            msg: 'Error al procesar el cambio de contraseña.'
          });
        }
        

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
