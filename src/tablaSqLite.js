const {optionsSqLite} = require('./utils/optionsSqLite');
const knex = require('knex')(optionsSqLite);

knex.schema.createTable('mensajes', table => {
    table.string('email', 25).notNullable();
    table.timestamp('fecha').notNullable();
    table.string('mensaje').notNullable();
})
.then(() => { console.log('Tabla creada') })
.catch((error) => { console.error({ codigo: error.code, msg: error.sqlMessage }) })
.finally(() => {
    knex.destroy();
})