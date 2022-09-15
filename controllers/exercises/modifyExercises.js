const getDB = require('../../database/getDB');
const { generateError, savePhoto } = require('../../helpers');

const modifyExercises = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        //console.log(req.files.photo)
        let photoName;
        if (req.files && req.files.photo) {
            photoName = await savePhoto(req.files.photo);
        }
        console.log(photoName)

        // Recuperamos el id del ejercicio de los params
        const { idExercise } = req.params;

        // Recuperamos los datos del cuerpo de la peticion
        const { title, description, typology } = req.body;

        // Si no envia nada para editar, lanzaremos un error
        if (!title && !description && !typology && !photoName) {
            throw generateError('No se ha insertado ningún nuevo dato.', 400);
        }

        // Seleccionamos los datos antiguos del ejercicio
        const [exercise] = await connection.query(
            `SELECT title, description, typology, photo FROM exercises WHERE id = ?`,
            [idExercise]
        );

        console.log(idExercise)

        // Actualizamos la tabla exercises con los nuevos datos
        await connection.query(
            `UPDATE exercises 
                SET title = ?,
                description = ?,
                typology = ?,
                photo = ?
                WHERE id = ?`,
            [
                title || exercise[0].title,
                description || exercise[0].description,
                typology || exercise[0].typology,
                photoName || exercise[0].photo,
                idExercise,
            ]
        );

        res.send({
            status: 'Ok',
            message: `El ejercicio con id ${idExercise} ha sido modificado con éxito!`,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = modifyExercises;
