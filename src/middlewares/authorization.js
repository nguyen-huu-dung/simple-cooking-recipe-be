import createHttpError from 'http-errors';
import { JsonWebTokenError } from 'jsonwebtoken';
import AuthService from '../services/AuthService';
import Messages from '../utils/Messages';
import Constants from '../utils/Constants';
import ResponseUtil from '../utils/ResponseUtil';

export const authorization = async (req, res, next) => {
    const authService = new AuthService();
    const responseResult = new ResponseUtil().responseResult;
    let token,
        locale = Constants.LANGUAGE.vi;
    try {
        // lấy ra token và locale trong headers
        if (!req.headers || !req.headers.authorization) {
            throw createHttpError(403, Messages.TOKEN_EXPIRE);
        }

        token = req.headers.authorization;

        if (req.headers.locale) {
            locale = req.headers.locale;
        }

        if (token.startsWith('Bearer ')) {
            token = token.substring(7, token.length);
        }

        // kiểm tra token
        const decode = authService.helperService.verifyUuidWithJSONWebToken(token);
        if (!decode) {
            throw new JsonWebTokenError();
        }

        // xác thực người dùng
        const result = await authService.asyncAuthorization({
            decode,
            token
        });

        if (!result.success) throw createHttpError(result.code, result.message);

        req.user = result.data.user;
        req.token = token;
        next();
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            error.status = 401;
            error.message = Messages.TOKEN_EXPIRE;
        }

        if ((error?.status === 401 || error?.status === 403) && token) {
            authService.asyncSignOut(token);
        }

        res.status(error?.status || 500).json(responseResult(
            false,
            error?.message?.[locale] ?? error?.[locale] ?? error?.message,
            null
        ));
    }
};
