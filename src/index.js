require('dotenv').config();


//Servidor http
const express = require('express');
const app = express();
const http = require('http').Server(app);
//Routes
app.use(require('./routes/littlezoom.routes'));
//Public files
app.use(express.static(__dirname + "/public"));


//Bot telegram
const bot = require('./static/js/bot.js');


//Generate images
const imageGenerator = require('./static/js/image');
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
    }
};

io.on('connection', (socket) => {
    socket.on('stream', image => {
        //Store frames on frame array
        imageGenerator.generateImage({
            base64Image: image,
            id: bot.getUserProps().id,
            i: 0,
            callback: bot.getUserProps().callback
        });
    });
    socket.on('disconnect', reason => {
        console.log('Web client disconnected');
        //Get image array
        /*const images = [];
        for (let i = 1; i <= iterator; i++){
            images.push(`${__dirname}/static/img/${bot.getUserProps().id}-frame-${i}.png`);
        }
        bot.getUserProps().callback(images);*/
    });
});

//Telegram bot
bot.init();

//Start express server
http.listen(3000, () => {
    console.log('Servidor en el puerto: 3000');
});