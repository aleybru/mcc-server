//Controller  Messages

const { response, request } = require('express');
const middlewares = require('../middlewares');
const Message = require('../models/message');
const Server = require('../models/server');

const getMessages = async (req = request, res = response) => {
    try {
        const uid = req.uid;

        const {
            from = 0,
            limit = 10,
            type,
            status
        } = req.query;

        const query = { user: uid };

        if (type) query.type = type.toUpperCase();
        if (status) query.status = status.toUpperCase();

        const [count, messages] = await Promise.all([
            Message.countDocuments(query),
            Message.find(query)
                .skip(Number(from))
                .limit(Number(limit))
                .sort({ createdAt: -1 }) // más nuevos primero
                .populate('user', 'fullname username') // opcional: mostrar info del user
        ]);

        res.json({
            ok: true,
            count,
            from: Number(from),
            limit: Number(limit),
            messages
        });

    } catch (error) {
        console.error('💥 Error en getMessages:', error);
        res.status(500).json({
            ok: false,
            msg: 'Error al obtener los mensajes'
        });
    }
};


const getMessage = async (req = request, res = response) => {

    const { id } = req.params;
    const message = await Message.findById(id);


    res.json({
        ok: true,
        message,
        msg: 'get Api Message Controller'
    });
}


const postMessages = async (req = request, res = response) => {
    try {
        const mensajes = req.body;

        if (!Array.isArray(mensajes) || mensajes.length === 0) {
            return res.status(400).json({
                ok: false,
                msg: 'La lista está vacía, no hay mensajes para enviar.'
            });
        }

        const mensajesValidos = [];
        const mensajesInvalidos = [];

        for (const [i, msg] of mensajes.entries()) {
            const { subject, body, recipient, type } = msg;

            const errores = [];

            if (!subject) errores.push('Asunto requerido');
            if (!body) errores.push('Cuerpo requerido');
            if (!recipient) errores.push('Destinatario requerido');
            if (!['EMAIL', 'SMS'].includes((type || '').toUpperCase())) errores.push('Tipo inválido (EMAIL o SMS)');

            if (errores.length > 0) {
                mensajesInvalidos.push({ index: i, errores, msg });
                continue;
            }

            mensajesValidos.push(new Message({
                subject,
                body,
                recipient,
                type: type.toUpperCase(),
                user: req.uid
            }));
        }

        const guardados = await Message.insertMany(mensajesValidos);

        // Emitir por socket
        const server = Server.getInstance();
        guardados.forEach(m => {
            server.io.emit('send-message', {
                subject: m.subject,
                body: m.body,
                recipient: m.recipient,
                type: m.type,
                mid: m._id
            });
        });

        return res.json({
            ok: true,
            enviados: guardados.length,
            rechazados: mensajesInvalidos.length,
            errores: mensajesInvalidos
        });

    } catch (error) {
        console.error('💥 Error en postMessages:', error);
        return res.status(500).json({
            ok: false,
            msg: 'Error interno al procesar los mensajes.'
        });
    }
};






// const putMessages = async (req = request, res = response) => {

//     res.json({
//         ok: true,
//         msg: 'put Api Messages Controller'
//     });
// }

// const patchMessages = (req = request, res = response) => {

//     res.json({
//         ok: true,
//         msg: 'patch Api Messages Controller'
//     });
// }

// const deleteMessages = async (req = request, res = response) => {

//     res.json({
//         ok: true,
//         msg: 'delete Api Messages Controller'
//     });
// }

module.exports = {
    getMessages,
    getMessage,
    postMessages,
    // putMessages,
    // patchMessages,
    // deleteMessages
}