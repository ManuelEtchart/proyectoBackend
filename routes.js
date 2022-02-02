const express = require('express');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({extended: true}));

let productos = [];
let contador = 1;

router.post('/', (req, res) => {
    productos.push(
        {
            id: contador,
            nombre: req.body.nombre,
            precio: req.body.precio
        }
    )
    res.json({'Objeto agregado': {'nombre': req.body.nombre, 'precio': req.body.precio, 'id': contador}});
    contador = productos[productos.length - 1].id + 1;
})

router.get('/', (req, res) => {
    if (productos.length === 0){
        res.json({'msg': 'No hay productos agregados'})
    }
    res.json({'productos': productos});
});

router.get('/:id', (req, res) => {
    let productoBuscado = productos.find(prod => prod.id == req.params.id);
    if(productoBuscado === undefined){
        res.json({error: `Producto ${req.params.id} no encontrado`})
    }
    res.json(productoBuscado);
});

router.put('/:id', (req, res) => {
    let productoBuscado = productos.find(prod => prod.id == req.params.id);

    if(productoBuscado === undefined){
        res.json({error: `Producto ${req.params.id} no encontrado`})
    }

    productoBuscado = {
        id: req.params.id,
        nombre: req.query.nombre,
        precio: req.query.precio
    };

    productos = productos.filter(prod => prod.id != req.params.id);

    productos.push(productoBuscado);

    res.json({msg: `Producto ${req.params.id} modificado`});
})

router.delete('/:id', (req, res) => {
    let productoBuscado = productos.find(prod => prod.id == req.params.id);

    if(productoBuscado === undefined){
        res.json({error: `Producto ${req.params.id} no encontrado`})
    }

    productos = productos.filter(prod => prod.id != req.params.id);
    
    if(productos.length === 0){
        res.json({'msg': 'Todos los productos han sido eliminados'})
    }
    res.json(`Producto ${req.params.id} eliminado`)
})

module.exports = router;