class BasesDeDatos{
    confgDB;
    tabla;

    constructor(confgDB, tabla){
        this.confgDB = confgDB;
        this.tabla = tabla;
    };

    insert(objeto){
        const knex = require('knex')(this.confgDB);

        knex(this.tabla).insert(objeto)
        .then(() => { console.log('Producto agregado') })
        .catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
        .finally(() => {
            knex.destroy();
        })
    };

    select(){
        const knex = require('knex')(this.confgDB);

        knex(this.tabla).select('*')
        .then((rows) => {
            for(const row of rows){
                console.log(`${row['id']}, ${row['nombre']}, ${row['precio']}`)
            }
        })
        .catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
        .finally(() => {
            knex.destroy();
        })
    };

    selectById(id){
        const knex = require('knex')(this.confgDB);

        knex(this.tabla).select('*').where('id','=', id)
        .then((rows) => {
            for(const row of rows){
                console.log(`${row['id']}, ${row['nombre']}, ${row['precio']}`)
            }
        })
        .catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
        .finally(() => {
            knex.destroy();
        })
    };

    update(id, atributo, nuevoValor){
        const knex = require('knex')(this.confgDB);

        knex(this.tabla).where('id','=', id).update(atributo, nuevoValor)
        .then(() => { console.log('Producto modificado') })
        .catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
        .finally(() => {
            knex.destroy();
        })
    };

    deleteAll(){
        const knex = require('knex')(this.confgDB);

        knex(this.tabla).del()
        .then(() => { console.log('Todos los productos han sido eliminados') })
        .catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
        .finally(() => {
            knex.destroy();
        })
    };

    deleteById(id){
        const knex = require('knex')(this.confgDB);

        knex(this.tabla).where('id','=', id).del()
        .then(() => { console.log(`Producto ${id} eliminado`) })
        .catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
        .finally(() => {
            knex.destroy();
        })
    };
};

module.exports = BasesDeDatos;