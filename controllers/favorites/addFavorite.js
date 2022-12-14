const getDB = require('../../database/getDB');


//Requerimos dependencias

const addFavorite = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //Establecemos conexión con la BBDD
        const idReqUser = req.userAuth.id;

        //const { idUser, idExercises } = req.params;
        const { idExercises } = req.params;

        const [isFavorite] = await connection.query(
            `SELECT * FROM user_favorites_exercises WHERE id_user = ? AND id_exercises = ?`,
            [idReqUser, idExercises]
        );

        if (isFavorite.length < 1) {
            await connection.query(
                `INSERT INTO user_favorites_exercises(id_user, id_exercises)
            VALUES (?, ?)`,
                [idReqUser, idExercises]
            );

            const [favoritesCount] = await connection.query(
                `SELECT count(id) as favorites FROM user_favorites_exercises WHERE id_exercises=?`,
                [idExercises]
            );

            res.send({
                status: 'Ok',
                message: 'Has marcado este ejercicio como favorito',
                favorited: true,
                favoritesCount: favoritesCount[0].favorites,
            });
        } else {
            await connection.query(
                `DELETE FROM user_favorites_exercises WHERE id_user = ? AND id_exercises = ?`,
                [idReqUser, idExercises]
            );

            const [favoritesCount] = await connection.query(
                `SELECT count(id) as favorites FROM user_favorites_exercises WHERE id_exercises=?`,
                [idExercises]
            );

            res.send({
                status: 'Ok',
                message: 'Lo has quitado de tu lista de favoritos',
                favorited: false,
                favoritesCount: favoritesCount[0].favorites,
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

module.exports = addFavorite;