const mysql = require('mysql2/promise');

require('dotenv').config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASS, MYSQL_DATABASE }= process.env

const conxionLocal = async () => {
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
                timezone: 'Z',
            });

            //Ejecutar el metodo getConnection y dovolver una conexion libre
            return await pool.getConnection();

        }

    } catch (error){
        console.error(error.message);
    }
};
conxionLocal();

const createDB = async () => {
    let conexion;

    try {
        conexion = await conxionLocal();
  
        await conexion.query(`CREATE DATABASE ${MYSQL_DATABASE}`);
        console.log("Database Created Successfully !");

        await conexion.query(`USE ${MYSQL_DATABASE}`)
        console.log("Using Database");
                
        console.log(`Created and Using ${MYSQL_DATABASE} Database`);

    } catch (error) {
        console.error(error.message);
    } finally {

        //Siempre al final cerramos la conexion con la base de datos
        if (conexion) conexion.release();

        // Finalizamos la ejecucion de script
        process.exit();
    }

        
};

createDB();