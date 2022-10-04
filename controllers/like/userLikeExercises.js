const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

//Requerimos las dependencias

const userLikeExercises = async (req, res, next) => {
    let connection;

    try {
        //Conectamos con la BBDD

        connection = await getDB();

        const idReqUser = req.userAuth.id;

        const {idExercises} = req.params;

        /* const { idUser_Like_Exercises } = req.params;
        console.log(req.params) */

        const [users_like_exercises] = await connection.query(
            `SELECT * FROM user_like_exercises WHERE id_exercises = ? AND id_user = ?`,
            [ idExercises, idReqUser ]
        );

        if (users_like_exercises.length <= 0) {
            throw generateError('Ejercicio sin like', 404);
        }

        if (users_like_exercises.length <= 0) {
            res.send({
                status: 'Ok',
                message: 'NO',
            });

        } else {
            res.send({
            status: 'Ok',
            message: 'ckecked',
        });
        }     

    } catch (error) {
        next(error);
        //aquí se lanza el error
    } finally {
        if (connection) connection.release();
        //Aquí se cierra la conexión con la BBDD
    }
};

module.exports = userLikeExercises;
