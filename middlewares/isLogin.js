// Requerimos la conexion a la base de datos
const getDB = require('../database/getDB');

// Requerimos el jwt para utilizar el token
const jwt = require('jsonwebtoken');

// Requerimos a la funcion del mensaje de error
const { generateError } = require('../helpers');

// Requerimos el dotenv para la utilizacion de las variables de entono (.env)
require('dotenv').config();

// Creamos la funcion para comprobar que el usuario esta logado
const isLogin = async ( req, res, next ) => {
    let conexion;

    try {
        // Abrimos la conexion a la BBDD
        conexion = await getDB();

        // Obtener la cabecera de autorizacion donde va a ir el token
        const { authorization } = req.headers;

        // Si no indica la cabecera de autorizacion lanzaremos un error
        if (!authorization) {
            throw generateError('Falta la cabecera de autorizacion', 401); // Unauthorized
        }

        // Variable que almacenará la info del token
        let tokenInfo;
        
        // Desencriptar el token (cabecera de autorizacion) recibida
        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
            } catch (error) {
            // Si el token no es valido, no es generado por nosotros
            throw generateError('No has iniciado sesion', 401);
            }
      
        // El token devuelve un id, seleccionamos de la base de datos al usuario con ese id
        const [user] = await conexion.query(
            `SELECT * FROM users WHERE id = ?`,[tokenInfo.id]
        );

        // Si no hubiera un usuario con ese id en la base de datos lanzariamos un error
        if (user.length < 1) {
            throw generateError('El token no es válido', 401);
        }

        // Si el usuario existe, y el token es válido, creamos en la request una propiedad que guardará
        // el id del usuario que ha hecho login
        req.userAuth = tokenInfo;

        // SI todo OK, lo pasamos
        next();

        
    } catch (error) {
        next(error)

    } finally {
        if (conexion) conexion.release();
    }

}

module.exports = isLogin;