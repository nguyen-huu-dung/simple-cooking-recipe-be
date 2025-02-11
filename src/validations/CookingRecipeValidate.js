import joi from 'joi';
import Constants from '../utils/Constants';

class CookingRecipeValidate {

    constructor() {
        this.constants = Constants;
    }

    createCookingRecipe(data) {
        const schema = joi.object({
            name: joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.INPUT).required(),
            introduce: joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.TEXTAREA).required(),
            menus: joi.array().items(joi.number().positive().required()).optional().empty().allow(null),
            typeDish: joi.number().allow('', null),
            makeWay: joi.number().allow('', null),
            ingredients: joi.array().items(joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.INPUT).required()).min(1).required(),
            ration: joi.number().positive().min(1).required('form_error_validate.required'),
            totalTime: joi.number().positive().min(1).required('form_error_validate.required'),
            instructions: joi.array().items(joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.TEXTAREA).required()).min(1).required()
        });
        return schema.validate(data);
    }

    updateStatusCookingRecipe(data) {
        const schema = joi.object({
            status: joi.number().valid(...Object.values(this.constants.STATUS)).required()
        });
        return schema.validate(data);
    }

    updateCookingRecipe(data) {
        const schema = joi.object({
            name: joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.INPUT).required(),
            introduce: joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.TEXTAREA).required(),
            menus: joi.array().items(joi.number().positive().required()).optional().empty().allow(null),
            typeDish: joi.number().allow('', null),
            makeWay: joi.number().allow('', null),
            ingredients: joi.array().items(joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.INPUT).required()).min(1).required(),
            ration: joi.number().positive().min(1).required('form_error_validate.required'),
            totalTime: joi.number().positive().min(1).required('form_error_validate.required'),
            instructions: joi.array().items(joi.string().trim().max(this.constants.MAX_LENGTH_DEFAULT.TEXTAREA).required()).min(1).required(),
            image: joi.string().allow('', null).optional().empty()
        });
        return schema.validate(data);
    }
}

export default CookingRecipeValidate;
