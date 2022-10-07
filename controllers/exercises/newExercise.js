/* const { validate } = require('uuid'); */
const getDB = require('../../database/getDB');
const { generateError, savePhoto, validate } = require('../../helpers');
const newExerciseSchema = require('../../schemas/newExerciseSchema');

const newExercise = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        //console.log(req.files.photo)
        
        //Llamamos a la funcion savePhoto para que nos devueva el nombre 
        //de la foto a insertar en la BBDD
       

        const idReqUser = req.userAuth.id
        //console.log("idReqUser: " + idReqUser)

        // Obtenemos los datos necesarios.
        const { title, description, typology } = req.body;

        if (!idReqUser || !title || !description || !typology) {
            throw generateError('Faltan campos obligatorios', 400);
        }

        await validate(newExerciseSchema, req.body)
    
        if (title.length < 3){
            throw generateError(
                'El titulo debe tener mas de 3 caractéres.',
                400
            );
        }

        // Si la descripción es demasiado corta lanzamos un error.
        if (description.length < 20) {
            throw generateError(
                'El campo descripción tiene menos de 20 caractéres, especifica más detalles sobre el ejercicio.',
                400
            );
        }

        if (!req.files || !req.files.photo) {
            throw generateError(
                'No has indicado una foto nueva de producto a subir',
                400
            );
        }

        const photoName = await savePhoto(req.files.photo);
        console.log(photoName)


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
            `INSERT INTO exercises (idUser, title, description, typology, photo)
    VALUES (?, ?, ?, ?, ?)`,
            [idReqUser, title, description, typology, photoName]
        );

        // Enviamos una respuesta.
        res.send({
            status: 'Ok',
            message: 'Ejercicio creado con éxito',
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = newExercise;
