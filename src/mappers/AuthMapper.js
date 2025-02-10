import Utils from '../utils/Utils';

class AuthMapper {

    constructor() {
        this.utils = new Utils();
    }

    responseProfile(profile) {
        const { code, full_name: fullName, email, gender, birthday } = profile;

        return {
            code,
            fullName,
            email: this.utils.maskEmail(email),
            gender,
            birthday
        };
    }
}

export default AuthMapper;
