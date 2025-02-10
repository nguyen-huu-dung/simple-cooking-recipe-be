import joi from 'joi';
import Regex from '../utils/Regex';
import Constants from '../utils/Constants';

class AuthValidate {

    constructor() {
        this.regex = Regex;
        this.constants = Constants;
    }

    signInWithOTP(data) {
        const schema = joi.object({
            email: joi.string().trim().pattern(this.regex.EMAIL).required()
        });
        return schema.validate(data);
    }

    confirmSignInWithOTP(data) {
        const schema = joi.object({
            uuid: joi.string().trim().required(),
            confirmOTP: joi.string().trim().max(6).pattern(this.regex.ONLY_NUMBER).required()
        });
        return schema.validate(data);
    }

    updateProfile(data) {
        const schema = joi.object({
            fullName: joi.string().trim().allow('', null),
            gender: joi.number().valid(...Object.values(this.constants.GENDER)).allow('', null),
            birthday: joi.string().allow('', null)
        });

        return schema.validate(data);
    }
}

export default AuthValidate;
