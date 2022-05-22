const path = require('path');

//Routes  
const { Router, request, response } = require('express');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares');
const { getWebSite } = require('../controllers/website');


//const { ...methods } = require('../controllers/');

const router = Router();

// list all 
router.get('/', (req = request, res = response) => {
    res.sendFile(path.resolve('./public/index.html'));
});

router.get('/chgpwd/:code',
    [
        check('code').notEmpty(),
        validateFields
    ]
    , getWebSite);

router.get('*', (req = request, res = response) => {
    res.sendFile(path.resolve('./public/404.html'));
});


module.exports = router;