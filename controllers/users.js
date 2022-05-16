//USERS Controlador

const { response, request } = require('express');

const getUsers = ( req = require, res = response )=>{

    const query = req.query;

    res.json({
        ok: true,
        query,
        msg: 'get Api USER Controller'
    });
}
const postUsers = ( req = require, res = response )=>{

    const body = req.body;

    res.json({
        ok: true,
        body,
        msg: 'post Api USER Controller'
    });
}
const putUsers = ( req = require, res = response )=>{

    const id = req.params.id;

    res.json({
        ok: true,
        id,
        msg: 'put Api USER Controller'
    });
}
const patchUsers = ( req = require, res = response )=>{


    res.json({
        ok: true,
        msg: 'patch Api USER Controller'
    });
}
const deleteUsers = ( req = require, res = response )=>{


    res.json({
        ok: true,
        msg: 'delete Api USER Controller'
    });
}


module.exports= {
    getUsers,
    postUsers,
    putUsers,
    patchUsers,
    deleteUsers
}
