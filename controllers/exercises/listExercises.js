const getDB = require('../../database/getDB');
const { generateError } = require('../../helpers');

// Funcion encargada de listar los productos en base de datos
const listExercises = async (req, res, next) => {
    let connection;

    try {
        // Abrimos una nueva conexion a la base de datos
        connection = await getDB();

        const { typology, id, title } = req.query;

        const validTypologyOptions = ['cardio', 'musculacion', 'natacion', 'relajacion'];


        if(typology && !validTypologyOptions.includes(typology)){
            throw generateError ("No existe la tipologia", 404)
        }


        /** Consulta para la BBDD */
        /** SELECT e.title,l.id_exercises, COUNT(*) AS n_like 
         * FROM user_like_exercises l INNER JOIN exercises e ON e.id=l.id_exercises 
         * GROUP BY id_exercises ORDER by n_like DESC; */

        let consulta = 'SELECT e.id, e.idUser, e.title, e.description, e.typology, e.photo, COUNT(l.id) AS n_like FROM user_like_exercises l RIGHT JOIN exercises e ON e.id=l.id_exercises'
        
        let values = [];
        let clause = " WHERE";
        if(typology){
            consulta += ` ${clause} e.typology LIKE ?`
            values.push(typology)
            clause = " AND"
        }

        if(id){
            consulta += ` ${clause} e.id LIKE ?`
            values.push(id)
            clause = " AND"
        }

        if (title){
            consulta += ` ${clause} e.title LIKE ?`
            values.push(`%${title}%`)
        }
        consulta += ` GROUP BY e.id ORDER BY n_like DESC`;
        //console.log(consulta)

        const [datos] = await connection.query(consulta, values)

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
