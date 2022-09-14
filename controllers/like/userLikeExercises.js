const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

//Requerimos las dependencias

const userLikeExercises = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la BBDD

        connection = await getDB();

        const { idUser_Like_Exercises } = req.params;

        const [users_like_exercises] = await connection.query(
            `SELECT * FROM user_like_exercises WHERE id = ?`,
            [idUser_Like_Exercises]
        );
        console.log(users_like_exercises);

        if (users_like_exercises.length < 0) {
            throw generateError('Ejercicio sin like', 404);
        }

        res.send({
            status: 'Ok',
            message: 'like marcado',
        });
    } catch (error) {
        next(error);
        //aquí se lanza el error
    } finally {
        if (connection) connection.release();
        //Aquí se cierra la conexión con la BBDD
    }
};

module.exports = userLikeExercises;
