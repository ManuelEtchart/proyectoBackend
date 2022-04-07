const express = require('express');
const BasesDeDatos = require('./basesDeDatos')
const { optionsSql } = require('./src/utils/optionsSql');
//const { optionsSqLite } = require('./src/utils/optionsSqLite');
const {Server: HttpServer} = require('http');
const { Server: IOServer } = require('socket.io');
const path = require('path')

const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo');

const {faker} = require('@faker-js/faker')
const Memoria = require('./src/contenedores/contenedorMemoria.js')
const {normalizar} = require('./src/utils/normalizar.js');

const sql = new BasesDeDatos(optionsSql, 'productos');
//const sqLite = new BasesDeDatos(optionsSqLite, 'mensajes');

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const mongo = connectMongo.create({
      mongoUrl:'mongodb://localhost:27017/ecommerce',
      ttl: 60
   })

app.use(cookieParser())
app.use(session({
   store: mongo,
   secret: '123456789!#$%&/()',
   resave: false,
   saveUninitialized: false
}))

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

app.get('/', (req,res)=>{
   if(!req.session.nombre){
      io.on('connection', (socket) =>{
         socket.emit('logs', {nombre: undefined});
      })
      res.redirect('/login.html')
   }else{
      res.redirect('/')
   }
});

app.post('/api/login', (req,res)=>{
   req.session.nombre = req.body.nombreUsuario
      
   console.log(req.session.nombre)
   
   
   io.on('connection', (socket) =>{
      socket.emit('logs', {nombre: req.session.nombre});
   })
   res.redirect('/')
})

app.get('/api/logout', (req,res)=>{
   if(!req.session.nombre){
      io.on('connection', (socket) =>{
         socket.emit('logs', {nombre: undefined});
      })
      res.redirect('/login.html')
   }else{
      req.session.destroy(err => {
         if(err){
            return res.json({error: err})
         }else{
            
         }
      })
      res.redirect('/logout.html')
   }
});

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

   socket.on('log', log => {io.sockets.emit('logs', {nombre: undefined})})
   
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
