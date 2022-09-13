const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

const deleteExercise = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idExercise } = req.params;

        // Primero comprobamos que el ejercicio existe
        const [exercise] = await connection.query(
            `SELECT * FROM exercises WHERE id = ?`,
            [idExercises]
        );

        if (exercise.length < 1) {
            throw generateError('El ejercicio no existe', 404);
        }

        // Si existe, procederemos a eliminar el ejercicio.

        await connection.query(`DELETE FROM exercises WHERE id = ?`, [
            idExercises,
        ]);

        res.send({
            status: 'Ok',
            message: 'El ejercicio ha sido eliminado.',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = deleteExercise;
