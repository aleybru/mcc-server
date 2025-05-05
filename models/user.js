//user model
const { Schema, model } = require('mongoose');
const applyPasswordHashing = require('../middlewares/hash-password');

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
        mobile: {
            type: String,
            required: [true, 'El teléfono móvil es requerido'],
            match: [/^\+?[1-9]\d{6,14}$/, 'Número de teléfono inválido']
        },
        role: {
            type: String,
            required: true,
            enum: ['ADMIN', 'USER'],
            default: 'USER'   
        },
        status: {
            type: Boolean,
            default: true
        },
        img:{
            type: String
        }
    }, { timestamps: true }
    
    );

    // Aplicar middleware
    applyPasswordHashing(UserSchema);


    UserSchema.methods.toJSON = function() {
        const { __v, password, _id, ...user  } = this.toObject();
        user.uid = _id;
        return user;
    }

module.exports = model( 'User', UserSchema);