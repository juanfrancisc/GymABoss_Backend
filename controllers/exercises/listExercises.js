const getDB = require('../../database/getDB');

// Funcion encargada de listar los productos en base de datos
const listExercises = async (req, res, next) => {
    let connection;

    try {
        // Abrimos una nueva conexion a la base de datos
        connection = await getDB();

        const { order, direction } = req.query;

        const validOrderOptions = ['title'];

        const validDirectionOptions = ['DESC', 'ASC'];

        const orderBy = validOrderOptions.includes(order) ? order : 'title';

        const orderDirection = validDirectionOptions.includes(direction)
            ? direction
            : 'DESC';

        /** Consulta para la BBDD */
        /** SELECT e.title,l.id_exercises, COUNT(*) AS n_like 
         * FROM user_like_exercises l INNER JOIN exercises e ON e.id=l.id_exercises 
         * GROUP BY id_exercises ORDER by n_like DESC; */

        // Realizar una consulta a la base de datos para recuperar los productos
        //let consulta = 'SELECT e.title,l.id_exercises, COUNT(*) AS n_like FROM user_like_exercises l INNER JOIN exercises e ON e.id=l.id_exercises GROUP BY id_exercises ORDER by n_like DESC;';

        let consulta = 'SELECT e.title, e.id, COUNT(l.id) AS n_like FROM user_like_exercises l RIGHT JOIN exercises e ON e.id=l.id_exercises GROUP BY e.id ORDER BY n_like DESC;'
        /*[consulta] = await connection.query(
            consulta + ` ORDER BY ${orderBy} ${orderDirection}`,
            ['title']
        );*/

        console.log(consulta)

        const [datos] = await connection.query(consulta)

        res.send({
            status: 'Ok',
            data: datos,
        });
    } catch (error) {
        // Si ocurre algun error lo pasamos (en el servidor lo captura el middleware de error para mostrarlo)
        next(error);
    } finally {
        // Para evitar llegar al límite de conexiones y saturar la base de datos
        // Cerramos la conexion
        if (connection) connection.release();
    }
};

// Exportar el controlador
module.exports = listExercises;
