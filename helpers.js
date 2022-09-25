const { unlink } = require('fs/promises');
const path = require('path'); //Dependencia que nos sirve para crear rutas absolutas
const sharp = require('sharp'); //Dependencia para el tratamiento de imagenes
const uuid = require('uuid'); //Dependencia para crear un nombre unico a un fichero subirdo

// Requerimos nodemailer para el envio de correos electronicos
const  nodemailer = require('nodemailer');

// Requerimos dotenv para el acceso a las variables
require('dotenv').config();



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
        console.log(photoPath)
        
        // Eliminamos la imagen
        await unlink(photoPath);

    } catch (error) {
        throw new Error('Error al eliminar la imagen del servidor');
    }
}

function generateRandomPass(){
    const caracteres = "abcdefghijkmnlopqrstuvwxyzABCDEFGHJKMNLOPQRSTUVWXYZ0123456789";
    let newPassword = "";
    for (let i = 0; i < 20 ; i++) {
        newPassword +=caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
    }
    console.log(newPassword)

    return newPassword;
}

// Acceso a las varaibles que necesito para los correos electronicos
const { DOMINIO, USER_MAIL, PASS_MAIL }= process.env;

//Creamos el objeto de transporte
const  lanzarMail = nodemailer.createTransport({
    service: DOMINIO,
    auth: {
        user: USER_MAIL,
        pass: PASS_MAIL,
    }
});

module.exports = { 
    generateError,
    savePhoto,
    deletePhoto,
    generateRandomPass,
    lanzarMail
};