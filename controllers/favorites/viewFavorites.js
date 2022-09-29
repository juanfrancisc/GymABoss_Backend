const getDB = require('../../database/getDB')
const generateError = require('../../helpers')


const viewFavorites = async (req, res, next) => {
    let conexion;

    try {
        //Conectamos con la BBDD
        conexion = await getDB();

        //Recuperamos el id del usuario desde la cabecera del token
        const idReqUser = req.userAuth.id;
        

        // Selecionamos los ejercios de la tabla de favoritos que coinciden con la id del usuario
        const [myFavorites] = await conexion.query(
            `SELECT ex.title, ex.description, ex.photo, ex.typology, ex.id  FROM exercises ex INNER JOIN user_favorites_exercises fa ON ex.id=fa.id_exercises WHERE fa.id_user = ?`,
            [idReqUser]
        )

        // Si el array no tiene datos, mostramos un mensaje
        if (myFavorites.length < 1){
            res.send ({
                status: 'OK',
                message: 'No tienes ejercicios marcados como favoritos'
            })
        } 
        // Pero si tiene datos lo devolvemos
        res.send ({
            status: 'Ok',
            message: 'Estos son tus favoritos',
            data: myFavorites,
        })
        
    } catch (error) {
        next(error);
        
    } finally {
        if (conexion) conexion.release();
    }

};

module.exports = viewFavorites;