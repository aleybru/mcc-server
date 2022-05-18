//Model  Message
const { Schema, model } = require('mongoose');

const MessageSchema = Schema(
    {
        subject: {
            type: String,
            required: [true, 'El Asunto es requerido'],
            default: 'Atención!'
        },
        body: {
            type: String,
            required: [true, 'El Cuerpo del mensaje es requerido']
        },
        status: {
            type: String,
            default: 'ENVIADO',
            emun: ['PENDIENTE','ENVIADO', 'CANCELADO'],
        },
        recipient: {
            type: String,
            required: [true, 'El destinatario es requerido'],
        },
        type: {
            type: String,
            required: [true, 'El tipo de mensaje es requerido'],
            emun: ['WHATSAPP', 'SMS'],
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    { timestamps: true }
);

MessageSchema.methods.toJSON = function () {
    const { __v, _id, ...message } = this.toObject();
    message.mid = _id;
    return message;
}

module.exports = model('Message', MessageSchema);