const express = require('express');
const app = express();
//Servidor http a partir de express
const http = require('http').Server(app);
//Routes
app.use(require('./routes/littlezoom.routes'));
//Public files
app.use(express.static(__dirname + "/public"));


module.exports = http;
