//middleware  Validate JWT

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no proporcionado en el header Authorization'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(uid);

        if (!user || !user.status) {
            return res.status(401).json({
                ok: false,
                msg: 'Token inválido o usuario inactivo'
            });
        }

        req.user = user.toJSON();
        req.uid = uid;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token inválido'
        });
    }
};

module.exports = {
    validateJWT
};
