//Helper  Email Server

const { model } = require('mongoose');
const { response, request } = require('express');
const path = require('path');

const nodemailer = require('nodemailer');

const hbs = require('nodemailer-express-handlebars');


const emailServer = async ( email ) => {
    
    const server = process.env.EMAIL_SERVICE;
    const user = process.env.EMAIL_SENDER;
    const pass = process.env.EMAIL_SENDER_PASSWORD;

    

    const handlebarsOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve('./views/partials'),
            defaultLayout: email.defaultLayout,
            layoutsDir: path.resolve('./views/layouts'),
        },
        viewPath: path.resolve('./views'),
        extName: '.handlebars'
    }

    const transporter = nodemailer.createTransport({
            service: server,
            auth: {
                user: user,
                pass: pass
            },
            secure: true,
        });

        transporter.use('compile',hbs(handlebarsOptions));

       
        
        var mailOptions = {
            from: email.from || user,
            to: email.to,
            subject: email.subject,
            template: email.template,
            context: email.context
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