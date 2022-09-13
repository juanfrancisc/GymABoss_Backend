const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

////Requerimos las dependencias.

const GetUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //Conectamos con la base de datos

        const { idUser } = req.params;

        //Usamos el path param del usuario del que queremos saber los datos

        const [user] = await connection.query(
            `SELECT * FROM users WHERE id = ?`,
            [idUser]
        );

        //Comprobar que existe un usuario con esa id en la BBDD

        if (user.length < 1) {
            throw generateError('No existe el usuario seleccionado', 404);
        }

        //Si el usuario existe lo devolvemos

        res.send({
            status: 'Ok',
            data: user[0],
        });
    } catch (error) {
        //aquí se lanza el error
        next(error);
    } finally {
        //Aquí se cierra la conexión con la BBDD
        if (connection) connection.release();
    }
};
//Se exporta la función
module.exports = GetUser;
