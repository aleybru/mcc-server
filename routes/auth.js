//AUTH Routes

const { Router } = require('express');

const router = Router();


//Registro de usuario
router.post('/register', ( req, res )=>{

    return res.json({
        ok:true,
        msg: 'user register'
    });
});

//Login de usuario
router.post('/login', ( req, res )=>{

    return res.json({
        ok:true,
        msg: 'user login'
    });
});

//Validar y revalidar token de usuario
router.get('/renew', ( req, res )=>{

    return res.json({
        ok:true,
        msg: 'renew user token'
    });
});


module.exports = router;