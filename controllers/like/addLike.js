const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

//Requerimos dependencias

const addLike = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //Establecemos conexión con la BBDD
        console.log(req.userAuth)
        const idReqUser = req.userAuth.id
        console.log(idReqUser)

        //const { idUser, idExercises } = req.params;
        const { idExercises } = req.params;

        const [isLike] = await connection.query(
            `SELECT * FROM user_like_exercises WHERE id_user = ? AND id_exercises = ?`,[idReqUser,idExercises]
        )

        if (isLike.length < 1){
            await connection.query(
            `INSERT INTO user_like_exercises(id_user, id_exercises)
            VALUES (?, ?)`,
            [idReqUser, idExercises]
            )
            res.send({
                status: 'Ok',
                message: 'te ha gustado',
            });
            

        } else {
            await connection.query(
                `DELETE FROM user_like_exercises WHERE id_user = ? AND id_exercises = ?`,[idReqUser,idExercises])         
            res.send({
                status: 'Ok',
                message: 'Ya no te gusta este ejercicio',
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

module.exports = addLike;
