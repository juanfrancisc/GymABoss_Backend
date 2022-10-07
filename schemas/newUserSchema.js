const Joi = require('joi');

const newUserSchema = Joi.object().keys({
    name: Joi.string()
    .required()
    .min(3)
    .max(20)
    .regex(/[A-Za-z]/)
    .error((errors)=>{
        if(
            errors[0].code === 'any.required' || errors[0].code === 'string.empty'
        ) {
            return new Error ('El nombre es un campo obligatorio')
        }
        return new Error ('El nombre debe de tener entre 3 y 20 caractéres, y NO contener números');
    }),

    email: Joi.string()
    .required()
    .max(100)
    .regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
    .error((errors) => {
        if(
            errors[0].code === 'any.required' || errors[0].code === 'string.empty'
        ){
            return new Error ('El correo es un campo obligatorio')
        }
        return new Error ('El correo debe una longitud máxima de 100 caractéres');
    }),

    password: Joi.string()
    .required()
    .min(8)
    .max(14)
    /** Minimo una miniscula y una mayuscula y solo desde la 0-9 y a-z y A-Z */
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)
    .error((errors) => {
        if(
            errors[0].code === 'any.required' || errors[0].code === 'string.empty'
        ){
            return new Error ('La contraseña es un campo obligatorio')
        }
        return new Error ('El contraseña debe una longitud minima de 8 caractéres, contener al menos una minuscula y una mayuscula y algún numero');
    })

});

module.exports = newUserSchema;
