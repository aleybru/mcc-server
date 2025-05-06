const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

// 🔍 Obtener todos los usuarios
const getUsers = async (req = request, res = response) => {
    try {
        const users = await User.find().select('-password'); // no enviar password nunca
        res.json({
            ok: true,
            users,
            msg: 'Lista de usuarios'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener usuarios'
        });
    }
<<<<<<< HEAD
    const user = await User.findByIdAndUpdate(id, u, { new: true });
    console.log(user);
    res.json({
        ok: true,
        user,
        msg: 'put Api USER Controller'
    });
}

const patchUsers = (req = request, res = response) => {
=======
};
>>>>>>> 210abbd83678a284e2b3d8d8a3a475671cf6435a

// ➕ Crear nuevo usuario
const postUsers = async (req = request, res = response) => {
    try {
        const { fullname, username, password, mobile } = req.body;

        const exists = await User.findOne({ username });
        if (exists) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario ya existe.'
            });
        }

        const user = new User({ fullname, username, password, mobile });

        // Hash en el middleware de pre-save (si ya lo tenés)
        await user.save();

        res.status(201).json({
            ok: true,
            user,
            msg: 'Usuario creado'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: `Error al crear usuario: ${error.message}`
        });
    }
};

// ✏️ Actualizar usuario
const putUsers = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, username, ...resto } = req.body;

<<<<<<< HEAD
=======
    try {
        if (password) {
            const salt = bcryptjs.genSaltSync();
            resto.password = bcryptjs.hashSync(password, salt);
        }

        const user = await User.findByIdAndUpdate(id, resto, { new: true }).select('-password');
        res.json({
            ok: true,
            user,
            msg: 'Usuario actualizado'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al actualizar usuario'
        });
    }
};

const patchUsers = async (req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, username, ...campos } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id, campos, { new: true }).select('-password');
        res.json({
            ok: true,
            user,
            msg: 'Usuario actualizado parcialmente'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: `Error al actualizar parcialmente el usuario: ${error.message}`
        });
    }
};


// ❌ Eliminar usuario
const deleteUsers = async (req = request, res = response) => {
    const { id } = req.params;
    try {
        await User.findByIdAndDelete(id);
        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar usuario'
        });
    }
};

>>>>>>> 210abbd83678a284e2b3d8d8a3a475671cf6435a
module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
};
