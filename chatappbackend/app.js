"use strict";

const express = require("express");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors"); //para poder hacer peticiones desde el cliente

const app = express(); //inicializar express
const httpServer = createServer(app); //inicializar servidor
const io = new Server(httpServer, {}); //inicializar websocket

require('dotenv').config();

//inicializar base de datos
require("./server/Utils/mongoose");

//Establecer puerto del servidor
app.set("port", process.env.PORT);

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); //para poder retornar datos en formato json
app.use(cors({origin: process.env.ORIGIN})); // para poder hacer peticiones desde el cliente
app.use(express.static(`${__dirname}/public`)); //para poder acceder a contenido publico del servidor
app.use(fileUpload());
app.set('socketio', io);

//Manejo de peticiones por websocket
io.on("connection", (socket) => {
  require('./server/Utils/socketIOHandler')(socket, io);
});

//routes
app.use(require("./server/Router/Routes/routesGet"));
app.use(require("./server/Router/Routes/routesPost"));
app.use(require("./server/Router/Routes/routesDelete"));

httpServer.listen(process.env.PORT, () => {
  console.log(`Working on port: ${process.env.PORT}`);
});
