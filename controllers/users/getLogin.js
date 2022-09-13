const getDB = require('../../database/getDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateError } = require('../../helpers');
require('dotenv').config();

//Requerimos las dependencias.

const getLogin = async (req, res, next) => {
    let connection;
    try {
        //Conectamos con la base de datos

        connection = await getDB();

        //se obtienen los email y password del body

        const { email, password } = req.body;

        if (!email || !password) {
            throw generateError('Faltan campos obligatorios', 400);
        }

        //Se comprueba que existe un usuario con ese email en la base de datos.

        const [user] = await connection.query(
            `SELECT email, password FROM users WHERE email = ?`,
            [email]
        );

        let isValid;
        if (user.length > 0) {
            isValid = await bcrypt.compare(password, user[0].password);
        }

        //Otra manera de ver que la contraseña coincide con la del registro

        if (user.length < 1 || !isValid) {
            throw generateError(
                'No existe un usuario registrado con ese email',
                404
            );
        }
        //Si no existe un usuario con ese email lanzamos un error

        const validPassword = await bcrypt.compare(password, user[0].password);

        //Si existe ese usuario comprobamos que las contraseñas coinciden con laas del usuario

        if (!validPassword) {
            throw generateError('La contraseña es incorrecta', 401);
        }

        //Si no coinciden las contraseñas damos un error

        const tokenInfo = {
            id: user[0].id,
        };

        //Si el usuario indica un email y una contraseña correctas, generaremos un token de inicio de sesión.

        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '50d',
        });

        //Se crea el token

        res.send({
            status: 'Ok',
            authtoken: token,
        });

        //Se envía respuesta con el token generado
    } catch (error) {
        next(error);
        //aquí se lanza el error
    } finally {
        if (connection) connection.release();
        //Aquí se cierra la conexión con la BBDD
    }
};

module.exports = getLogin;
//Se exporta la función
