const { model } = require("mongoose");
const User = require("../models/user")
const Role = require('../models/role');


const isValidRole = async( role = '' ) => {

    const roleExists = await Role.findOne({ role });
    if ( !roleExists ) {
        throw new Error(`El role no está registrado.`);
    }
}

const emailExists = async ( username = '' ) => {
    const exists = await User.findOne({ username });
    if ( exists ){
        throw new Error( 'El nombre de usuario ya está registrado.' );
    }
}

const userIdExists = async ( id ) => {
    const exists = await User.findById( id );
    if( !exists ){
        console.log('encontró');
        throw new Error('El id brindado no existe.')
    }
}

module.exports = {
    emailExists,
    userIdExists,
    isValidRole
}