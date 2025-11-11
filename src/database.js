const mysql = require('mysql');
const {promisify} = require('util'); // modulo de nodejs para usar promesas
const {database} = require('./keys'); //importa la configuracion de la base de datos

const pool =mysql.createPool(database); //crea la conexion a la base de datos

pool.getConnection((err, connection) => {
    if(err){ //errores comunes
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Database connection was closed.');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('Database has too many connections.');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('Database connection was refused.');
        }
    }
    if(connection) connection.release();
    console.log('DB is Connected');
    return;
});

// Convertir pool.query a promesas
pool.query = promisify(pool.query).bind(pool);

module.exports = pool; //exporta la conexion

