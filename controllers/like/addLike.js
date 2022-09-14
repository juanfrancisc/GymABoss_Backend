const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

//Requerimos dependencias

const addLike = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //Establecemos conexión con la BBDD

        const { idUser, idExercises } = req.body;

        await connection.query(
            `INSERT INTO user_like_exercises(id_user, id_exercises)
            VALUES (?, ?)`,
            [idUser, idExercises]
        );

        res.send({
            status: 'Ok',
            message: 'te ha gustado',
        });
    } catch (error) {
        next(error);
        //aquí se lanza el error
    } finally {
        if (connection) connection.release();
        //Aquí se cierra la conexión con la BBDD
    }
};

module.exports = addLike;
