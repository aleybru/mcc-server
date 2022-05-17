//USERS Controlador

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const getUsers = async (req = request, res = response) => {

    const users = await User.find();
    // const userloged = req.user;
    res.json({
        ok: true,
        users,
        // userloged,
        msg: 'get Api USER Controller'
    });
}

const postUsers = async (req = request, res = response) => {

    const { fullname, username, password, mobile } = req.body;

    const user = new User({ fullname, username, password, mobile });

    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);


    await user.save()
        .then((user) => {
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

const putUsers = async (req = request, res = response) => {

    const { id } = req.params;
    const {_id, password, username, ...u } = req.body;

    if (password) {
        const salt = bcryptjs.genSaltSync();
        u.password = bcryptjs.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate(id, u);
    res.json({
        ok: true,
        user,
        msg: 'put Api USER Controller'
    });
}
const patchUsers = (req = request, res = response) => {


    res.json({
        ok: true,
        msg: 'patch Api USER Controller'
    });
}

const deleteUsers = async (req = request, res = response) => {

    const { id } = req.params;
    console.log(id);
    const user = await User.findByIdAndDelete(id);
    
    res.json({
        ok: true,
        msg: 'delete Api USER Controller'
    });
}


module.exports = {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
}
