// Requerimos el express
const express = require('express');
// Requerimos morgan para que nos muestre mas informacion en consola
const morgan = require('morgan');

// Requerimos fileUpload para poder subir ficheros
const fileUpload = require('express-fileupload');

// Creamos la aplicacion/servidor con express
const app = express();

app.use(morgan('dev'));
app.use(fileUpload());

// Deserializamos el body en raw para leer los datos
app.use(express.json());

//////////////////
/** MIDDLEWARE */
//De usuario
const isAdmin = require('./middlewares/isAdmin');
const isLogin = require('./middlewares/isLogin');

/////////////////////////
/** CONTROLADORES */
// De usuario
const newRegisterUser = require('./controllers/users/newRegisterUsers');
const getLogin = require('./controllers/users/getLogin');
const getUser = require('./controllers/users/getUser');

// De ejercicios
const newExercises = require('./controllers/exercises/newExercise');
const modifyExercises = require('./controllers/exercises/modifyExercises');
const deleteExercises = require('./controllers/exercises/deleteExercises');
const getExercises = require('./controllers/exercises/getExercises');
//const uploadPhoto = require('./controllers/exercises/uploadPhoto');
const listExercises = require('./controllers/exercises/listExercises');

//Botón like
const userLikeExercises = require('./controllers/like/userLikeExercises');
const addLike = require('./controllers/like/addLike');

// Pruebas de envio de correo y restablecimiento de contraseña
//const postMail = require('./controllers/users/postMail');
//const retrievePass = require('./controllers/users/retrievePass');

/////////////////////////
/** ENDPOINTS */
// De usuario
/** Se comentan los endpoints para que no de error la ejecucion del servidor */
/** La siguiente linea es para verificar que el middleware de isAdmin funciona */
//app.post('/users/:idUser', isAdmin)
/** La siguiente linea es para verificar que el middleware de isAuth funciona */
//app.post('/users/:idUser', isAuth)

app.post('/newRegisterUsers', newRegisterUser);
app.post('/getLogin', getLogin);
app.get('/users/:idUser', getUser); //Recuperar datos del usuario

// De ejercicios
//app.put('/uploadPhoto', isLogin, isAdmin, uploadPhoto)
app.get('/listExercises', isLogin, listExercises);
// Preguntar isAuth por si no es necesario
app.post('/newExercise', isLogin, isAdmin, newExercises);
app.post('/modifyExercises/:idExercise', isLogin, isAdmin, modifyExercises);
//app.put('/modifyExercise/:idExercise', isAdmin, modifyExercises);
//app.delete('/deleteExercise/:idExercise', isAdmin, deleteExercises);

//botón like

app.get('/like/:idUser_Like_Exercises', userLikeExercises);
app.post('/addLike', addLike);

/////////////////////////////////////
/** MIDDLEWARE de ERROR y NOT FOUND*/

// Middleware de ERROR
app.use((error, req, res, next) => {
    //Mostramos el error, lo que tenga
    console.error(error);

    // Asignamos el codigo del error, creamos una propiedad httpStatus en los endpoint
    // donde asignaremos el codigo correspodiente, si no existe daremos error 500
    res.status(error.httpStatus || 500);

    //Enviamos la respuesta con el error
    res.send({
        status: 'Error',
        message: error.message,
    });
});

// Middleware de NOT FOUND - No encuentra la ruta
app.use((req, res) => {
    res.status(404);

    res.send({
        status: 'Error',
        message: 'Not found',
    });
});

/** FIN  MIDDLEWARE*/

/** SERVIDOR A LA ESCUCHA */
// Ponemos el server a la escucha
app.listen(4000, () => {
    console.log('Server listening at http://localhost:4000');
});
