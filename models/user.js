
const { Schema, model } = require('mongoose');

const UserSchema = Schema(

    {
        fullname: {
            type: String,
            required: [true, 'El nombre completo es requerido']
        },
        username: {
            type: String,
            required: [true, 'El nombre de usuario es requerido'],
            unique: true
        },
        password: {
            type: String,
            required: [true, 'La contraseña es requerida']
        },
        status: {
            type: Boolean,
            default: true
        }
    }
    
    )

module.exports =model( 'User', UserSchema);