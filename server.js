const express = require('express');

const app = express();

app.use(express.static('public'));

const router = require('./routes.js')

app.use('/api/productos', router)

const PORT = 8080;

const server = app.listen(PORT, () => {
   console.log(`Servidor escuchando en el puerto ${server.address().port}`);
});

server.on("error", error => console.log(`Error en servidor ${error}`));

