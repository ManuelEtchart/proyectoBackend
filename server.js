const express = require('express');
const fs = require('fs');
const {Server: HttpServer} = require('http');
const { Server: IOServer } = require('socket.io');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

let productos = [];
let mensajes = [];
let contador = 1;

io.on('connection', (socket) => {
   console.log('Nuevo cliente conectado');

   socket.emit('productos', {productos: productos});

   socket.emit('mensajes', {mensajes: mensajes});

   socket.on('productoIngresado', producto => {
      producto.id = contador;
      productos.push(producto);
      contador = productos[productos.length - 1].id + 1;
      io.sockets.emit('productos', {productos: productos});
   });

   socket.on('mensajeNuevo', mensaje => {
      let fechaactual = new Date();
      mensaje.fecha = `[(${fechaactual.getDay()}/${fechaactual.getMonth()}/${fechaactual.getFullYear()} ${fechaactual.getHours()}:${fechaactual.getMinutes()}:${fechaactual.getSeconds()})]`;
      console.log(mensaje);
      mensajes.push(mensaje);
      fs.writeFileSync('./chat.txt', JSON.stringify(mensajes,null,2));
      io.sockets.emit('mensajes', {mensajes: mensajes});
   })
})

const PORT = 8080;

const server = httpServer.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));
