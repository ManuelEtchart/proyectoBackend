const express = require('express');
const BasesDeDatos = require('./basesDeDatos')
const { optionsSql } = require('./src/utils/optionsSql');
//const { optionsSqLite } = require('./src/utils/optionsSqLite');
const {Server: HttpServer} = require('http');
const { Server: IOServer } = require('socket.io');

const {faker} = require('@faker-js/faker')
const Memoria = require('./src/contenedores/contenedorMemoria.js')
const {normalizar} = require('./src/utils/normalizar.js')

const sql = new BasesDeDatos(optionsSql, 'productos');
//const sqLite = new BasesDeDatos(optionsSqLite, 'mensajes');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'));

const productos = new Memoria();
const productosAleatorios = new Memoria();
const mensajes = new Memoria();

app.get('/api/productos-test', (req,res)=>{
   productosAleatorios.deleteAll()
   for (let i = 0; i < 5; i++) {
      productosAleatorios.save({
         nombre: faker.commerce.product(),
         precio: faker.commerce.price(),
         foto: faker.image.abstract()
      })
   }
   res.redirect('../index.html')
})

io.on('connection', (socket) => {
   console.log('Nuevo cliente conectado');

   socket.emit('productosAleatorios', {productosAleatorios: productosAleatorios.getAll()})

   socket.emit('productos', {productos: productos.getAll()});
   
   socket.emit('mensajes', {mensajes: normalizar(mensajes.getAll())});

   socket.on('productoIngresado',  producto => {
      sql.insert(producto);
      productos.save(producto);
      io.sockets.emit('productos', {productos: productos.getAll()})
   })
   
   socket.on('mensajeNuevo', mensaje => {
      let fechaActual = new Date();
      mensaje.fecha = `[(${fechaActual.getDay()}/${fechaActual.getMonth()}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}:${fechaActual.getSeconds()})]`;
      mensaje.author.avatar = faker.image.avatar();
      mensajes.save(mensaje);
      /*sqLite.insert(mensaje);*/
      io.sockets.emit('mensajes', {mensajes: normalizar(mensajes.getAll())});
   });
});



const PORT = 8080;

const server = httpServer.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));
