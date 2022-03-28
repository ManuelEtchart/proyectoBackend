const {normalize, schema} = require('normalizr')
function normalizar(array){

    const user = new schema.Entity('users',{idAttribute: 'email'})
 
    const mensaje = new schema.Entity('mensajes',{author: user})
 
    const listaMensajes = new schema.Entity('listaMensajes',{mensajes: [mensaje]},{idAttribute: 'id'})
 
    const normalizedData = normalize({id: 'mensajes', mensajes: array}, listaMensajes)
 
    return normalizedData
}

module.exports = {normalizar};