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




const socketController = ( socket )=>{

    console.log('cliente conectado', socket.id);

    socket.on('disconnect', ()=>{
        console.log('cliente desconectado', socket.id);
    });

    socket.on('enviar-mensaje', ( payload )=>{
       
        socket.broadcast.emit('enviar-mensaje', payload);
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