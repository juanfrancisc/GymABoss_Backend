/** Realiza la conexion con la base de datos */


// Requerimos a mysql
const mysql = require('mysql2/promise');

// Requerimos dotenv para acceder a las variables de entorno del archivo .env
require('dotenv').config();

//
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE }= process.env

// Funcion que exportaremos y devuelve una conexion a la base de datos
const getDB = async () => {
    let pool;

    try {
        // Si tenemos conexiones libre, creamos una conexion nueva
        if(!pool){
            //Creamos un grupo de conexiones
            pool = mysql.createPool({
                connectionLimit: 10,
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASS,
                database: MYSQL_DATABASE,
                timezone: 'Z',
            });

            //Ejecutar el metodo getConnection y dovolver una conexion libre
            return await pool.getConnection();

        }

    } catch (error){
        console.error(error.message);
    }
};

// Exportar la funcion que devuelve una conexion a la BBDD
module.exports = getDB;