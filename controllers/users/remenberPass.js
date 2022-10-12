//Requerimos la conexion a la BBDD
const getDB = require("../../database/getDB");

//Requerimos a las funciones generateError y generateRandomPass
const { generateError, generateRandomPass, lanzarMail } = require("../../helpers");

//Requerimo bcrypt 
const bcrypt = require('bcrypt');

const { USER_MAIL }= process.env;

const remenberPass = async (req, res, next) =>{

    let conexion;

    try {
        conexion = await getDB();

        // Recibibos el correo del usuario desde el body
        const { email } = req.body;
        console.log(email)

        // Si no se declara ningun correo lanzamos un error
        if (!email){
            throw generateError('Si no intruduces algun dato no poedemos ayudarte', 409)
        }
  
        // Localizamos si existe algun usuario con dicho correo
        const [usuario] = await conexion.query(
            `SELECT * FROM users WHERE email = ?`,[email]
        );
        

        // Si no hay ningun usuario con ese correo, lanzamos error
        if (usuario.length < 1){
            throw generateError (`No existe en nuestra base de datos ningún usuario con esa cuenta de correo ${email}`);
        }

        //Si existe ese correo, generamos una nueva contraseña, con la funcion generateRandomPass(), 
        //no funciona la funcion lo hago manunalmente aqui
        const newPassword = generateRandomPass();
        //console.log=(newPassword)

        //Y la encrriptamos para añadirla a la BBDD
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        //console.log(hashedPassword)

        await conexion.query(
            `UPDATE users SET password = ? WHERE email = ?`,[hashedPassword,email]
        );

        // Creamos el mensaje de correo que le enviamos al usuario
        const mailOptions = {
            from: USER_MAIL,
            to: usuario[0].email,
            subject: `Restablecimiento de contraseña generada de la app de Gym A Boss`,
            text:`La nueva contraseña generada es ${newPassword}, recueda acceder a la app y cambiar a una nueva`,
        };

        lanzarMail.sendMail(mailOptions);

        //Si todo bien enviamos la respuesta
        res.send({
            status: 'OK',
            message: `Se ha enviado un correo con una pass nueva al usuario con la direccion de correo ${email}`,
        })

    } catch (error) {
        next(error)

    } finally {
        if (conexion) conexion.release();
    }

};

module.exports = remenberPass;
