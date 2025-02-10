import { AuthMapper } from '../mappers';
import { AuthService } from '../services';
import Utils from '../utils/Utils';
import { AuthValidate } from '../validations';
import BaseController from './BaseController';

class AuthController extends BaseController {

    constructor() {
        super();
        // mapper
        this.authMapper = new AuthMapper();
        // validate
        this.authValidate = new AuthValidate();
        // service
        this.authService = new AuthService();
    }

    // #region [SIGN IN WITH OTP]
    asyncSignInWithOTP(req, res, next) {
        const LOG_TITLE = '[SIGN IN WITH OTP]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            // validate
            const { error, value } = this.authValidate.signInWithOTP(req.body);
            if (error) {
                return this.result(false, 400, this.messages.EMAIL_INVALID);
            }

            return await this.authService.asyncSignInWithOTP(value);
        });
    }
    // #endregion

    // #region [CONFIRM SIGN IN WITH OTP]
    asyncConfirmSignInWithOTP(req, res, next) {
        const LOG_TITLE = '[CONFIRM SIGN IN WITH OTP]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            // validate
            const { error, value } = this.authValidate.confirmSignInWithOTP(req.body);
            if (error) {
                return this.result(false, 400, this.messages.CONFIRM_SIGN_IN_WITH_OTP_INVALID);
            }

            return await this.authService.asyncConfirmSignInWithOTP(value);
        });
    }
    // #endregion

    // #region [GET PROFILE]
    asyncGetProfile(req, res, next) {
        const LOG_TITLE = '[GET PROFILE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            if (req.user) return this.result(true, 200, null, this.authMapper.responseProfile(req.user?.dataValues));

            return this.result(false, 500, this.messages.SERVER_ERROR);
        });
    }
    // #endregion

    // #region [UPDATE PROFILE]
    asyncUpdateProfile(req, res, next) {
        const LOG_TITLE = '[UPDATE PROFILE]';
        this.processRequest(req, res, next, LOG_TITLE, async () => {
            // validate
            const { error, value } = this.authValidate.updateProfile(req.body);
            if (error) {
                return this.result(false, 400, this.messages.BAD_REQUEST);
            }

            return this.authService.asyncUpdateProfile({
                ...value,
                userId: req.user?.id
            });
        });
    }
    // #endregion

    // #region [SIGN OUT]
    asyncSignOut(req, res, next) {
        const LOG_TITLE = '[SIGN OUT]';
        this.processRequest(req, res, next, LOG_TITLE, () => {
            return this.authService.asyncSignOut(req.token);
        });
    }

    // #endregion
}

export default AuthController;
