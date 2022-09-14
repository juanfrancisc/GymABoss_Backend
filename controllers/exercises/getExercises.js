const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

const getExercises = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idExercise } = req.params;

        // Seleccionamos los datos del ejercicio de la base de datos.
        const [exercises] = await connection.query(
            `SELECT * FROM exercises where id = ?`,
            [idExercise]
        );

        // Comprobamos si el ejercicio existe en nuestra base de datos
        if (exercises.length < 1) {
            throw generateError('El ejercicio no existe', 404);
        }
        // Si existe, creamos un objeto con los datos del ejercicio-
        const exerciseInfo = {
            id: exercises[0].id,
            name: exercises[0].title,
            description: exercises[0].description,
        };

        // Respondemos enviando la lista de los productos de la base de datos.
        res.send({
            status: 'Ok',
            data: exerciseInfo,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getExercises;
