// Requerimos el express
const express = require('express');
// Requerimos morgan para que nos muestre mas informacion en consola
const morgan = require('morgan');

// Requerimos fileUpload para poder subir ficheros
const fileUpload = require('express-fileupload');

// Requerimos CORS
const cors = require('cors');

// Creamos la aplicacion/servidor con express
const app = express();

//Habilitamos CORS
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    })
);



app.use(morgan('dev'));
app.use(fileUpload());

// Deserializamos el body en raw para leer los datos
app.use(express.json());

// Para declarar la ruta de los subida de imagenes
app.use('/imagenes', express.static('./static/imagenes'));

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
const newExerciseJF = require('./controllers/exercises/newExercise_pruebasJF')
const modifyExercises = require('./controllers/exercises/modifyExercises');
const deleteExercises = require('./controllers/exercises/deleteExercises');
const getExerciseId = require('./controllers/exercises/getExerciseId');
//const uploadPhoto = require('./controllers/exercises/uploadPhoto');
const listExercises = require('./controllers/exercises/listExercises');
const getTypolgy = require('./controllers/exercises/getTypology')

//Botón like
const userLikeExercises = require('./controllers/like/userLikeExercises');
const addLike = require('./controllers/like/addLike');

// Envio de correo para restablecimiento de contraseña
const remenberPass = require('./controllers/users/remenberPass');

// Add Favorite
const addFavorite = require('./controllers/favorites/addFavorite');
const viewFavorites = require('./controllers/favorites/viewFavorites')

/////////////////////////
/** ENDPOINTS */
// De usuario
/** Se comentan los endpoints para que no de error la ejecucion del servidor */
/** La siguiente linea es para verificar que el middleware de isAdmin funciona */
//app.post('/users/:idUser', isAdmin)
/** La siguiente linea es para verificar que el middleware de isAuth funciona */
//app.post('/users/:idUser', isAuth)
app.post('/register', newRegisterUser);
app.post('/getLogin', getLogin);
app.post('/login', getLogin);
app.get('/users', isLogin, getUser);
app.get('/users/:id', isLogin, getUser); //Recuperar datos del usuario
app.post('/remenberPass', remenberPass)

// De ejercicios
//app.put('/uploadPhoto', isLogin, isAdmin, uploadPhoto)
app.get('/listExercises', isLogin, listExercises);
//app.get('/getExercises', listExercises);
app.get('/getExercises', isLogin,listExercises);
app.get('/getExerciseId/:idExcercise', isLogin, getExerciseId);
//app.get('/verExercise/:idExcercise', getExerciseId);
app.get('/listExercises/:typology', isLogin, getTypolgy);
//app.get('/getExercises/:typology', getTypolgy);
app.post('/newExercise', isLogin, isAdmin, newExercises);
//app.post('/newExercise', isLogin, isAdmin, newExerciseJF);
app.post('/modifyExercises/:idExercise', isLogin, isAdmin, modifyExercises);
app.delete('/deleteExercise/:idExercise', isLogin,isAdmin, deleteExercises);
//app.delete('/deleteExercise/:idExercise', deleteExercises);



//botón like

app.get('/like/:idExercises', isLogin, userLikeExercises);
app.post('/addLike/:idExercises', isLogin, addLike);

// Add Favorite
app.post('/addFavorite/:idExercises', isLogin, addFavorite);
app.post('/viewFavorites', isLogin, viewFavorites)

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
