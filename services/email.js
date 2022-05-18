//Helper  Email Server

const { model } = require('mongoose');
const { response, request } = require('express');

const nodemailer = require('nodemailer');

const emailServer = async ( email ) => {
    
    const server = process.env.EMAIL_SERVICE;
    const user = process.env.EMAIL_SENDER;
    const pass = process.env.EMAIL_SENDER_PASSWORD;

    const transporter = nodemailer.createTransport({
            service: server,
            auth: {
                user: user,
                pass: pass
            },
            secure: true,
        });

        const textMsg = 'http://localhost:5000/api/auth/verify/' + email.code;
        const htmlMsg = '<h1>Código de verificación</h1><br><p>Para hacer uso de su cuenta debe activarla</p><br> <a href="http://localhost:5000/api/auth/verify/' + email.code + '">ACTIVAR CUENTA</a><p>Gracias</p>';
        
        var mailOptions = {
            from: email.from || user,
            to: email.to,
            subject: email.subject,
            text: textMsg,
            html: htmlMsg
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                throw new Error( error );
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }


module.exports = {
    emailServer,
}