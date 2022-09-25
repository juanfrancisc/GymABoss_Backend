const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

const newExercise = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        console.log(req.userAuth)
        const idReqUser = req.userAuth.id
        

        // Obtenemos los datos necesarios.
        const { title, description, typology } = req.body;
        console.log (req.body)
        
        if (!idReqUser || !title || !description || !typology ) {
            throw generateError('Faltan campos obligatorios', 400);
        }

        // Si la descripción es demasiado corta lanzamos un error.
        if (description.length < 20) {
            throw generateError(
                'Introduce más detalles sobre el ejercicio.',
                400
            );
        }

        // Comprobamos que no hay ningún ejercicio con el mismo nombre.
        const [exercise] = await connection.query(
            `SELECT * FROM exercises WHERE title = ?`,
            [title]
        );

        if (exercise.length > 0) {
            throw generateError(
                'Ya existe un ejercicio con el mismo nombre',
                409
            );
        }
        

        // Insertamos el nuevo ejercicio en la base de datos.
        await connection.query(
            `INSERT INTO exercises (idUser, title, description, typology)
    VALUES (?, ?, ?, ?)`,
            [idReqUser, title, description, typology]
        );

        // Enviamos una respuesta.
        res.send({
            status: 'Ok',
            message: 'Ejercicio creado con éxito',
            data: {idUser: idReqUser, title: title}
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newExercise;
