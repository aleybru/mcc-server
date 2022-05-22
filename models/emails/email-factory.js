const ResetPasswordTemplate = require("./reset-password");
const VerifyUserTemplate = require("./verify-user");


const path = require('path');


class EmailFactory {

    constructor(data) {
        this.data = this.create(data);
      
    }

    create = (data)=>{

        let outPut = {};

        switch (data.type) {
            case 'reset':
                outPut = new ResetPasswordTemplate(data);
                break;
            case 'verify':
                outPut = new VerifyUserTemplate(data);
                break;
        
            default:
                break;
        }
       return outPut;
    }


}


module.exports = EmailFactory;