const Message = require('../models/message');
//whatsapp Server
const {
    default: makeWASocket,
    DisconnectReason,
    useSingleFileAuthState,
    Browsers,
    isJidGroup,
    makeInMemoryStore,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    getContentType,
    jidDecode,
    delay
} = require('@adiwajshing/baileys');
const { Boom } = require('@hapi/boom'); 
const message = require('../models/message');




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

const connectToWhatsApp = async() => {
    console.log('conectando a whatsapp ');
    let sock = makeWASocket({
        // can provide additional config here
        
        printQRInTerminal: true
    });
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            const shouldReconnect = new Boom(lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut
            console.log('connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect)
            // reconnect if not logged out
            if(shouldReconnect) {
                connectToWhatsApp()
            }
        } else if(connection === 'open') {
            console.log('opened connection')
        }
    })
    sock.ev.on('messages.upsert', async m => {
        console.log(JSON.stringify(m, undefined, 2))

        console.log('replying to', m.messages[0].key.remoteJid)
        await sock.sendMessage(m.messages[0].key.remoteJid, { text: 'Hello there!' })
    })
}


module.exports = {
    socketController,
    connectToWhatsApp
}