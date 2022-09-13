const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

const modifyExercises = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Recuperamos el id del ejercicio de los params
        const { idExercises } = req.params;

        // Recuperamos los datos del cuerpo de la peticion
        const { title, description } = req.body;

        // Si no envia nada para editar, lanzaremos un error
        if (!title && !description) {
            throw generateError('No se ha modificado ningún dato.', 400);
        }

        // Seleccionamos los datos antiguos del ejercicio
        const [exercise] = await connection.query(
            `SELECT title, description FROM exercises WHERE id = ?`,
            [idExercises]
        );

        // Actualizamos la tabla exercises con los nuevos datos
        await connection.query(
            `UPDATE exercises 
              SET title = ?,
              description = ?
              WHERE id = ?`,
            [
                title || product[0].title,
                description || product[0].description,
                idExercises,
            ]
        );

        res.send({
            status: 'Ok',
            message: `El ejercicio con id ${idProduct} ha sido modificado con éxito!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = modifyExercises;
