const Joi = require('joi');

const newExerciseSchema = Joi.object().keys({
    title: Joi.string()
    .required()
    .min(3)
    .max(40)
    .regex(/[A-Za-z0-9]/)
    .error((errors)=>{
        if(
            errors[0].code === 'any.required' || errors[0].code === 'string.empty'
        ) {
            return new Error ('El titulo del ejercicio es un campo obligatorio')
        }
        return new Error ('El titulo debe de tener entre 3 y 40 caractéres');
    }),

    description: Joi.string()
    .required()
    .min(20)
    .max(250)
    .error((errors)=>{
        if(
            errors[0].code === 'any.required' || errors[0].code === 'string.empty'
        ) {
            return new Error ('La descripcion del ejercicio es un campo obligatorio')
        }
        return new Error ('La descripcion debe de tener entre 20 y 250 caractéres');
    }),

    typology: Joi.string()
    .required()
    .error((errors)=>{
        if(
            errors[0].code === 'any.required' || errors[0].code === 'string.empty'
        ) {
            return new Error ('La typologia del ejercicio es un campo obligatorio')
        }
        return new Error ('Se precisa indicar tipologia al ejercicio');
    }),

    photo: Joi.string()


});

module.exports = newExerciseSchema;
