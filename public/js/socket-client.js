//referencias HTML
const lblOnline = document.querySelector('#lblOnline');
const lblOffline = document.querySelector('#lblOffline');
const txtMensaje = document.querySelector('#txtMensaje');
const btnEnviar = document.querySelector('#btnEnviar');




const socket = io();

socket.on('connect', ()=>{
    console.log('Conectado', socket.id);
    lblOffline.style.display = 'none';
    lblOnline.style.display = '';
});

socket.on('disconnect', ()=>{
    console.log('Desconectado', socket.id);
    lblOffline.style.display = '';
    lblOnline.style.display = 'none';
});

socket.on('enviar-mensaje', ( payload )=>{
    console.log(payload);
    
});

btnEnviar.addEventListener('click', ()=>{
    const mensaje = txtMensaje.value;
    if(mensaje){
        const payload ={
            id:'123456',
            recipient:'095024444',
            subject:'Asunto: test de envio',
            body:'este es un mensaje de prototipo',
            date: new Date().getTime(),
            status:'enviando'

        };
        socket.emit('enviar-mensaje', payload);
    }   

});



