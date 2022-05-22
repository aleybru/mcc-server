
class ResetPasswordTemplate {

    constructor(data) {

        // console.log(data);
         this.email = {
             to: data.user.username,
             subject: 'MCC - Solicitud de cambio de contraseña',
             code: data.code,
             defaultLayout: 'email',
             template: 'emailreset',
             context: {
                 fullname: data.user.fullname,
                 code: data.code
             }
         }
 
 
     }
};

module.exports = ResetPasswordTemplate;