'use strict'
window.addEventListener('load', () => {

    let counter = 0;

    const canvas = document.querySelector('#preview');
    const context = canvas.getContext('2d');
    const btn = document.querySelector('#btn');
    const counterSelector = document.querySelector('#counter');

    canvas.style.display = "none";
    canvas.width = 512;
    canvas.height = 384;

    context.width = canvas.width;
    context.height = canvas.height;

    const video = document.querySelector('#video');
    const socket = io();

    function publicarMensaje(msg){
        document.querySelector('.status').innerText = msg;
    }

    function loadCamera(stream){
        video.srcObject = stream;
        publicarMensaje('camara funcionando');
    }

    function errorCamera(){
        publicarMensaje('camara ha fallado');
    }

    function verVideo(video, context){
        context.drawImage(video, 0, 0, context.width, context.height);
        socket.emit('stream', canvas.toDataURL('image/png'));
    }

    btn.addEventListener('click', () => {
        navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msgGetUserMedia);
        if(navigator.getUserMedia){
            navigator.getUserMedia({video: true}, loadCamera, errorCamera);
        }

        const intervalo = setInterval(()=>{
            verVideo(video, context);
        }, 5000);

        //Set connection for only 30 secconds
        const counterTime = 10;
        const connectionInterval = setInterval(()=>{
            if(counter != counterTime){
                counter++;
                counterSelector.innerText = `Seconds remaining: ${counterTime - counter}`;
            }
            else {
                socket.disconnect();
                counter = 0;
                /*clearInterval(intervalo);
                clearInterval(connectionInterval);*/
            }
        }, 1000);
    });

});