const Message = require('../models/message');
const { Boom } = require('@hapi/boom'); 




const socketController = ( socket )=>{

    console.log('cliente conectado', socket.id, socket.uid);


    socket.on('disconnect', ()=>{
        console.log('cliente desconectado', socket.id);
    });

    socket.on('send-message', ( payload )=>{
       //console.log('enviado--->',payload);
        socket.to( payload.uid).emit('send-message', payload );
    });
    socket.on('receive-message', async ( payload )=>{
        socket.to( payload.uid).emit('receibe-message', payload );
        
        if(payload.msg==='ENVIADO'){

            await Message.findByIdAndUpdate( payload.mid,{status: payload.status});
        }else{
            console.log(payload);
        }

    });

}




module.exports = {
    socketController,
}