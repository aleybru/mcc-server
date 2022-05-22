
const { Schema, model } = require('mongoose');

const VerifyCodeSchema = Schema(

    {
        code: {
            type: String,
            required: [true, 'El código de verificación es requerido']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        isused: {
            type: Boolean,
            default: false
        }, 
        type: {
            type: String,
            required: true,
            emun: ['VERIFY', 'RESET'],
        }
    }, { timestamps: true }
    
    );
    VerifyCodeSchema.methods.toJSON = function() {
        const { __v, password, _id, ...verifycode  } = this.toObject();
        verifycode.vid = _id;
        return verifycode;
    }

module.exports = model( 'VerifyCode', VerifyCodeSchema);