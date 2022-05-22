
class VerifyUserTemplate {

    constructor(data) {

       // console.log(data);
        this.email = {
            to: data.user.username,
            subject: 'MCC - Verificar cuenta de usuario',
            code: data.code,
            defaultLayout: 'email',
            template: 'emailverify',
            context: {
                fullname: data.user.fullname,
                code: data.code
            }
        }


    }

}
 
module.exports = VerifyUserTemplate;