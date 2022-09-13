const { unlink } = require('fs/promises');
const path = require('path'); // dependencia que nos sirve para crear rutas absolutas
const sharp = require('sharp');
const uuid = require('uuid');

// Funcion de error
function generateError(message, code){
    const error = new Error (message);
    error.httpStatus = code;
    return error;
}

// Creamos una variable con la ruta de la ubicacion de las imagenes
const fileImageDir = path.join(__dirname, 'static/imagenes');

// Funcion que guarda una foto en el servidor, devolverá el nombre de la foto para guardarlo en la base de datos
async function savePhoto(imagen) {

    try {
        // Convertir la imagen en un objeto sharp
        const sharpImage = sharp(imagen.data);

        // Variable que guardará la ruta absoluta a la carpeta donde se guarda la imagen junto a su nombre
        let imageDirectory;

        // Generar un nombre único a la imagen
        const imageName = uuid.v4() + '.jpg';

        imageDirectory = path.join(fileImageDir, imageName);

        // Guardar la imagen
        await sharpImage.toFile(imageDirectory);

        // Retornar el nombre único de la imagen para guardarla en base de datos
        return imageName;
    } catch (error) {
        throw new Error('Error al procesar la imagen');
    }
}

// Funcion que elimina una foto del servidor
async function deletePhoto(photoName) {

    try {
        let photoPath; // Variable para la ruta absoluta a la imagen a borrar

        photoPath = path.join(fileImageDir, photoName);
        
        // Eliminamos la imagen
        await unlink(photoPath);

    } catch (error) {
        throw new Error('Error al eliminar la imagen del servidor');
    }
}

module.exports = { 
    generateError,
    savePhoto,
    deletePhoto 
};