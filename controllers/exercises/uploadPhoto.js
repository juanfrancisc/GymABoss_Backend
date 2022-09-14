const getDB = require('../../database/getDB');
const { generateError, savePhoto } = require('../../helpers');

const uploadPhoto = async (req, res, next) => {
    

    let conexion;

    try {
        //Abrimos una conexion
        conexion = await getDB();

        // Recuperamos el tirulo desde los parametro
        const { title } = req.body;
        console.log(title)
        
        //console.log(req.files.photo)
        // Si no existe nimgun fichero.....
        if (!req.files || !req.files.photo) {
            throw generateError(
                'No has indicado una foto nueva de producto a subir',
                400
            );
        }
        //Llamamos a la funcion savePhoto para que nos devueva el nombre 
        //de la foto a insertar en la BBDD
        const photoName = await savePhoto(req.files.photo);
        console.log(photoName)

        //Actualizamos la BBDD
        /*let update = `Update exercises set photo = ${photoName} where title = ${title}`;
        await conexion.query(update)
        console.log(update)*/

        await conexion.query(
            `UPDATE exercises SET photo = ? WHERE title = ?`,[photoName, title]
        )        

        //Devolvemos un mensaje y el nombre de la foto
        res.send({
            status: 'Ok',
            message: 'Foto subida con exito!',
            data: {photoName: photoName}
        });
    
    } catch (error) {
        next(error)

    } finally {
        if (conexion) conexion.release();
    }

};

module.exports = uploadPhoto;