const { optionsSql } = require('./utils/optionsSql');
const knex = require('knex')(optionsSql);

knex.schema.createTable('productos', table => {
    table.increments('id');
    table.string('nombre', 25).notNullable();
    table.integer('precio').notNullable();
    table.string('foto').notNullable();
})
.then(() => { console.log('Tabla creada') })
.catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
.finally(() => {
    knex.destroy();
})