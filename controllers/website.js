//Controller  WebSite
const path = require('path');

const { response, request } = require('express');
const verifyCode = require('../models/verify-code');


const getWebSite = async (req = request, res = response) => {

    const { code } = req.params;

    const validCode = await verifyCode.findOne({ code, isused: false, type: 'RESET' });
    if (!validCode) {
        res.sendFile(path.resolve('./public/errorcode.html'));
    }
    res.sendFile(path.resolve('./public/chgpwd.html'));

}

module.exports = {
    getWebSite,

}