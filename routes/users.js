//Users Routes

const { Router } = require('express');
const { getUsers, postUsers, putUsers, patchUsers, deleteUsers } = require('../controllers/users');

const router = Router();

//Listar usuarios
router.get('/', getUsers);

//crear usuarios
router.post('/', postUsers);

//modificar usuarios
router.put('/:id', putUsers);

//actualizar usuarios
router.patch('/', patchUsers);

//eliminar usuarios
router.delete('/', deleteUsers);

// //Registro de usuario
// router.post('/register', ( req, res )=>{

//     return res.json({
//         ok:true,
//         msg: 'user register'
//     });
// });

// //Login de usuario
// router.post('/login', ( req, res )=>{

//     return res.json({
//         ok:true,
//         msg: 'user login'
//     });
// });



module.exports = router;