//Requerimos a la BD
const getDB = require('../../database/getDB');

// Requerimos a la funcion de generar error
const { generateError } = require('../../helpers');

const getTypology = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { typology } = req.params;
        console.log(typology)

        // Seleccionamos los datos del ejercicio de la base de datos.
        const [listTypology] = await connection.query(
            `SELECT e.title, e.id, e.typology, COUNT(l.id) AS n_like FROM user_like_exercises l RIGHT JOIN exercises e ON e.id=l.id_exercises WHERE typology = ? GROUP BY e.id ORDER BY n_like DESC;`,
            [typology]
        );

        // Comprobamos si la tipologia tiene ejercicios asignados
        if (listTypology.length < 1) {
            throw generateError('La tipologia seleciona no tiene ningun ejercicio asignado', 404);
        }

        // Respondemos enviando la lista de los productos de la base de datos.
        res.send({
            status: 'Ok',
            data: listTypology,
        });
    } catch (error) {
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getTypology;