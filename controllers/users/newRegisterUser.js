const getDB = require('../../database/getDB');
const { generateError } = require('../../herlpers');
const bcrypt = require('bcrypt');

//Requerimos las dependencias. Llamamos error, base de datos y el bcrypt para encriptar la contraseña

const NewRegisterUser = async (req, res, next) => {
    let connection;

    //Creamos la constante de la función, que será asincrona y establecemos la conexión.
    try {
        connection = await getDB();

        const { name, email, password, type_user } = req.body;
        if (!name || !email || !password || !type_user) {
            throw generateError(
                'Faltan campos obligatorios por completar',
                400
            );
        }

        //Hacemos la conexión con el await al ser asíncrono, creamos la constante con los datos que el usuario indique.

        //En caso de que el usuario no complete los campos necesarios lanzaremos un error comunicando que son necesarios campos obligatorios.
        const [user] = await connection.query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        );
        //Se comprueba que el email no existe en la base de datos.
        if (user.length > 0) {
            throw generateError(
                'Ya existe un usuario registrado con ese email',
                409
            );
        }
        //Si ene sta consulta se devuelve algún dato, querrá decir que un usuario con ese mismo email ya existe.
        const Hashedpassword = await bcrypt.hash(password, 10);
        //Encriptamos la contraseña con hashedpassword y bcrypt(instalando esta dependencia).

        await connection.query(
            `INSERT INTO users(name, email, password, type_user)
            VALUES (?, ?, ?, ?)`,
            [name, email, Hashedpassword, type_user]
        );
        //Aquí se inserta el nuevo usuario, con el nombre, email, contraseña y tipo de usuario.

        res.send({
            status: 'Ok',
            message: 'Usuario creado con éxito',
        });

        //Se envía esta respuesta para saber que todo ha ido bien
    } catch (error) {
        next(error);
        //aquí se lanza el error
    } finally {
        if (connection) connection.release();
        //Aquí se cierra la conexión con la BBDD
    }
};

module.exports = NewRegisterUser;
//Se exporta la función
