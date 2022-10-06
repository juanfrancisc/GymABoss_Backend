/** Archivo que inicirá y reiniciará las tablas de la base de datos */

// Requerir getDB
const getDB = require('./getDB');

// Tras instalar la dependencia npm i dotenv, y tener el fichero .env requerimos acceso a el
require('dotenv').config();

// Funcion que creará y borrará las tablas de la base de datos
async function main() {
    //Crear la variable que contine la conexion a la BBDD
    let conexion;

    try {
        //Abrir una conexion con a base de datos
        conexion = await getDB();
        //console.log(conexion)

        //Si todo va bien tenemos la conexion con la base de datos abierta
        console.log('Conexion con base de datos realizada');

        // Eliminar las tablas de la base de datos si existe
        console.log('Eliminando tablas si existen...');

        await conexion.query(`DROP TABLE IF EXISTS user_favorites_exercisess`);
        await conexion.query(`DROP TABLE IF EXISTS user_like_exercises`);
        await conexion.query(`DROP TABLE IF EXISTS exercises`);
        await conexion.query(`DROP TABLE IF EXISTS users`);

        // Crear las tablas de la base de datos
        console.log('Creando tablas...');

        console.log('Creando tabla de usuarios...');
        await conexion.query(`
            CREATE TABLE IF NOT EXISTS users (
                id int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
                name varchar(15) NOT NULL,
                email varchar(100) NOT NULL UNIQUE,
                password varchar(255) NOT NULL,
                type_user enum('normal','admin') NOT NULL)`);

        console.log('Creando tabla de ejercicios...');
        await conexion.query(
            `CREATE TABLE exercises (
                id int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
                idUser int unsigned NOT NULL,
                title varchar(45) NOT NULL UNIQUE,
                description text NOT NULL,
                photo varchar(100) NOT NULL,
                typology enum('Natacion','Musculacion','Cardio','Relajacion') NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id)
              )`
        );

        console.log('Creando tabla de usuarios crea ejercicios...');
        await conexion.query(
            `CREATE TABLE user_like_exercises (
                id int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
                id_user int unsigned NOT NULL,
                id_exercises int unsigned NOT NULL,
                FOREIGN KEY (id_exercises) REFERENCES exercises (id)
                ON DELETE CASCADE
              )`
        );
        
        await conexion.query(
            `CREATE TABLE user_favorites_exercises (
                id int unsigned PRIMARY KEY NOT NULL AUTO_INCREMENT,
                id_user int unsigned NOT NULL,
                id_exercises int unsigned NOT NULL,
                FOREIGN KEY (id_user) REFERENCES users (id)
                ON DELETE CASCADE,
                FOREIGN KEY (id_exercises) REFERENCES exercises (id)
                ON DELETE CASCADE
              )`
        );

        console.log('Tablas creadas!');

        //Insertar datos en la base de datos
        console.log('Insertando datos en la base de datos...');

        console.log('Insertando usuarios de administradores de ejemplo...');
        await conexion.query(
            `INSERT INTO users (name,email, password, type_user) VALUES ('admin', 'admin@gym.com', '123456789', 'admin'),
            ('admin10', 'admin10@gym.com', '123456789', 'admin');`
        );

        console.log('Insertando usuarios de ejemplo...');
        await conexion.query(
            `INSERT INTO users (name, email, password) VALUES ('user1', 'user1@user1.com', '12345'),
                ('user2', 'user2@user1.com', '12345'),
                ('user3', 'user3@user1.com', '12345'),
                ('user4', 'user4@user1.com', '12345'),
                ('user5', 'user5@user1.com', '12345');`
        );

        console.log('Insertando ejercicios de ejemplo...');
        await conexion.query(
            `INSERT INTO exercises (idUser, title, description,  typology, photo) VALUES 
            (1, 'Sentadillas', 'Realimos agachadillas hasta media altura y mantenemos unos segundos, nos ponemos ergidos y volvemos a comenzar. Unas 20 repeticiones con 10 segundos de descanso entre ellas','Cardio','foto.jpg')
            ,(1, 'Abdominales', 'El ejercicio estándar de encogimiento abdominal se concentra en los músculos del estómago. Es un ejercicio eficaz y seguro que es ideal para principiantes, para ayudar a desarrollar músculos abdominales fuertes.', 'Musculacion', 'foto.jpg')
            ,(1, 'Flexiones', 'Las flexiones son un excelente ejercicio para trabajar los músculos del pecho y los brazos. Debido a la posición que usted tiene que mantener para hacer este ejercicio correctamente, también trabaja el núcleo, abdominales, piernas y espalda. Diferentes variaciones de las flexiones plantearán un nuevo desafío los mismos grupos musculares.','Cardio', 'foto.jpg')
            ,(1, 'Nado a Crol', 'Este estilo es de forma alternada, mientras uno de los brazos del nadador se mueve en el aire con la palma hacia abajo dispuesta a ingresar al agua, y el codo relajado, el otro brazo avanza bajo el agua','Natacion', 'foto.jpg')`
        );

        console.log('Insertando datos de favorios de ejemplo....');
        await conexion.query(
            `INSERT INTO user_like_exercises (id_user, id_exercises) VALUES ('3', '2'),
            ('4', '1'),
            ('5', '4');`
        );

        console.log('Datos de ejemplo insertados!');
    } catch (error) {
        console.log(error.message);
    } finally {
        //Siempre al final cerramos la conexion con la base de datos
        if (conexion) conexion.release();

        // Finalizamos la ejecucion de script
        process.exit();
    }
}

// Ejecutamos la función
main();
