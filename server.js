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

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
//app.use(express.static('public'));

const hds = require('express-handlebars');

app.set('views', path.join(path.dirname(''), 'src/views'));

app.engine('.hbs', hds.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
}))

app.set('view engine', '.hbs');

app.use(cookieParser())
app.use(session({
   secret: '123456789!#$%&/()',
   resave: false,
   saveUninitialized: false,
   cookie: {
      secure: 'auto',
      maxAge: 600000
   }
}))

const FACEBOOK_APP_ID = 'xxxxxxx';
const FACEBOOK_APP_SECRET = 'xxxxxxxxxxxxxxxxxxx';

passport.use(new FacebookStrategy({
   clientID: FACEBOOK_APP_ID,
   clientSecret: FACEBOOK_APP_SECRET,
   callbackURL: "http://localhost:8080/auth/facebook/callback",
   profileFields: ['id', 'displayName', 'photos', 'email']
 },
 function(accessToken, refreshToken, profile, cb) {
   return cb(null, profile);
 }
));

passport.serializeUser((user, cb) => {
   cb(null, user);
});

passport.deserializeUser((obj, cb) => {
   cb(null, obj);
});

app.use(passport.initialize());
app.use(passport.session());

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
   if(req.isAuthenticated()){

      const datosUsuario = {
         nombre: req.user.displayName,
         foto: req.user.photos[0].value,
         email: req.user.email 
      };

      res.render('inicio', {mensajes: mensajes.getAll(), productos: productos.getAll(), datos: datosUsuario})
   }else{
      res.redirect('/api/login')
   }
});

app.get('/api/login', (req,res)=>{
   res.render('login')
})

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', { 
      failureRedirect: '/login',
      successRedirect: '/' 
   }
))

app.get('/api/logout', (req,res)=>{
   req.logout()
   res.redirect('/')
});

app.post('/api/productos', (req,res) =>{
   productos.save({
      nombre: req.body.nombre,
      precio: req.body.precio,
      foto: req.body.urlFoto
   })
   res.redirect('/')

})

app.post('/api/mensajes', (req,res) =>{
   const mensaje = {
      email: req.body.email,
      nombre: req.body.nombreMensaje,
      apellido: req.body.apellido,
      edad: req.body.edad,
      alias: req.body.alias,
      mensaje: req.body.mensaje
   }
   let fechaActual = new Date();
   mensaje.fecha = `[(${fechaActual.getDay()}/${fechaActual.getMonth()}/${fechaActual.getFullYear()} ${fechaActual.getHours()}:${fechaActual.getMinutes()}:${fechaActual.getSeconds()})]`;
   mensaje.avatar = faker.image.avatar();
   mensajes.save(mensaje)
   res.redirect('/')
});
/*
io.on('connection', (socket) => {
   console.log('Nuevo cliente conectado');

   

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
      //sqLite.insert(mensaje);
      //io.sockets.emit('mensajes', {mensajes: normalizar(mensajes.getAll())});
   });
});
*/


const PORT = 8080;

const server = httpServer.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));
