const { Schema, model } = require('mongoose');

const RoleSchema = Schema(

    {
        rolename: {
            type: String,
            required: [true, 'El nombre es requerido']
        }
    }, { timestamps: true }
    
    );
    RoleSchema.methods.toJSON = function() {
        const { __v, password, _id, ...role  } = this.toObject();
        role.rid = _id;
        return role;
    }

module.exports = model( 'Role', RoleSchema);