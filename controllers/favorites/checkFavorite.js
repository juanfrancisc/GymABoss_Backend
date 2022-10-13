const getDB = require('../../database/getDB');

const checkFavorite = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const idReqUser = req.userAuth.id;

        const { idExercise } = req.params;

        const [[favorite]] = await connection.query(
            `SELECT * FROM user_favorites_exercises WHERE id_user = ? AND id_exercises = ?`,
            [idReqUser, idExercise]
        );

        res.send({ status: 'ok', isFavorite: favorite ? true : false });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = checkFavorite;