const express = require('express');

const Contenedor = require('./contenedor.js');

const producto = new Contenedor('productos.txt');

let productos = producto.getAll();

const app = express();

app.get('/productos', (req, res) => {
    res.send({productos: JSON.stringify(productos)});
});

app.get('/productoRandom', (req, res) => {
    console.log(productos)
    let productoAleatorio = productos.find(prod => prod.id === ((Math.random()*3)+1));
    console.log(productoAleatorio)
    res.send({productoAleatorio: JSON.stringify(productoAleatorio)});
});

const PORT = 8080;

const server = app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));
