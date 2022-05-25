//Controller  Messages

const { response, request } = require('express');
const middlewares = require('../middlewares');



const Message = require('../models/message');
const Server = require('../models/server');

const getMessages = async (req = request, res = response) => {
    try {

        const [count, messages] = await Promise.all([Message.countDocuments({ user: req.user }), Message.find({ user: req.user })]);

        res.json({
            ok: true,
            count,
            messages,
            msg: 'post Api Messages Controller'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error,
            msg: 'Error general'
        });
    }
}

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

        const { subject, body, recipient, type } = req.body;

        const message = new Message({
            subject,
            body,
            recipient,
            type,
            user: req.user
        });

        // Guardar DB
         const result = await message.save();
// console.log(result);
        if (!result) {
            return res.status(400).json({
                ok: false,
                msg: 'Error al guardar el mensaje'
            });
        } else {

        const server = Server.getInstance();

        const users = [];
        for (let [id, socket] of server.io.of("/").sockets) {
            users.push({
                userID: id,
                uid: socket.uid,
            });
        }
        const sid = users.find(u => u.uid === req.uid);
        const payload = {
            subject,
            body,
            recipient,
            sid: sid.userID,
            uid: sid.uid,
            mid: result._id
        }
       // console.log(payload);
        server.io.to(sid.userID).emit('send-message', {
            payload
        });

        }


        res.json({
            ok: true,
            req: req.body,
            msg: 'post Api Messages Controller'
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            error,
            msg: 'Error general'
        });
    }
}

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