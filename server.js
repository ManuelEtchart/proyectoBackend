const express = require('express');

const app = express();

const Contenedor = require('./contenedor');

const producto = new Contenedor('./productos.txt');

app.get('/', (req, res) => {
    res.send("Bienvenidos - Ir a /productos o /productoRandom");
})

app.get('/productos', async (req, res) => {
    let productos = await producto.getAll();
    res.send({productos: `${JSON.stringify(productos)}`});
});

app.get('/productoRandom', async (req, res) => {
    let productos = await producto.getAll();
    let random = Math.floor((Math.random()*3)+1);
    let productoAleatorio = productos.find(prod => prod.id === random);
    res.send({productoAleatorio: `${JSON.stringify(productoAleatorio)}`});
});

const PORT = 8080;

const server = app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));