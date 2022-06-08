const express = require('express');
const app = express();
//Servidor http a partir de express
const http = require('http').Server(app);
//Routes
app.use(require('../../routes/littlezoom.routes'));
//Public files
app.use(express.static(__dirname + "/public"));

//Generate Video
//const videoshow = require('./static/js/videoshow.js');
//Generate images
const imageGenerator = require('./image.js');
//Inicializar servicio socket.io
const io = require('socket.io')(http);

//Socket.io
const socketimage = {
    id: '',
    callback: ()=>{},
    setImageTrigger: (id, callback) => {
        socketimage.id = id;
        socketimage.callback = callback;
        console.log('setted id: ', socketimage.id);
    },
    server: http
};

io.on('connection', (socket) => {
    let iterator = 0;
    socket.on('stream', image => {
        iterator++;
        //Store frames on frame array
        imageGenerator.generateImagePromise({
            base64Image: image,
            id: socketimage.id,
            i: iterator
        }).then(success => console.log(success));
        
        //Emitir el evento a todos los sockets conectados
        //socket.broadcast.emit('stream', image);
    });
    socket.on('disconnect', reason => {
        //Convert jpg images to .mp4 file
        /*videoshow.generateVideoFile({
            id: base64Frames.id,
            iterator: iterator, 
            callback: ({file}) => {
                console.log('File succesfully generated: ', file);
            }
        });*/
        //Get image array
        const images = [];
        for (let i = 1; i <= iterator; i++){
            images.push(`${__dirname}/../img/${socketimage.id}-frame-${i}.png`);
        }
        socketimage.callback(images);
    });
});

module.exports = socketimage;