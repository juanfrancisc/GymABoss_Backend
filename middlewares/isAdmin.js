// Requerimos la conexion a la base de datos
const getDB = require("../database/getDB");

// Requerimos el fichero helpers para la utilizacion del mensaje de error
const { generateError } = require("../helpers");

// Creamos la funcion para comprobar si el usuario es administrador
const isAdmin = async ( req, res, next ) => {

    //Creamos una variable de conexion
    let conexion;

    try {
        
        conexion = await getDB();

        //Recuperamos el id del usuario
        const idReqUser = req.userAuth.id;

        const [typeUser] = await conexion.query(
            `Select type_user from users where id = ?`,[idReqUser]
        );
        //console.log(typeUser)
        
        //Si el usuario no es de tipo admin
        if (typeUser[0].type_user !== 'admin'){
            throw generateError ('El usuario logado NO es de tipo admin', 409)
        }

        next();
    } catch (error) {
        next(error)

    } finally {
        if (conexion) conexion.release();
    }


}

module.exports = isAdmin;