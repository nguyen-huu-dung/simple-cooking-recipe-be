import ResponseUtil from '../utils/ResponseUtil';
import fs from 'fs';
import Constants from '../utils/Constants';
import { LoggerSystem } from '../helpers/logger';
import Messages from '../utils/Messages';

class BaseController {

    constructor() {
        // logger
        this.logger = LoggerSystem;
        // constants
        this.constants = Constants;
        this.messages = Messages;
        // utils
        this.responseUtil = new ResponseUtil();
        this.result = this.responseUtil.result;
        this.responseResult = this.responseUtil.responseResult;
    }

    // Hàm xử lý yêu cầu của request
    async processRequest(req, res, next, logTitle, resolve, processOptions) {
        this.logger.debug(logTitle, 'START');
        let result;
        try {
            result = resolve && await resolve();
        } catch (error) {
            this.logger.error(logTitle, error);
            result = this.result(false, 500, error.message);
        } finally {
            processOptions?.finally && processOptions.finally();
            this.processResponse(res, result, {
                locale: req.headers.locale
            });
            this.logger.debug(logTitle, 'END', result?.success, result?.message);
        }
    }

    // Hàm trả về kết quả của request
    processResponse(res, result, { locale = this.constants.LANGUAGE.vi }) {
        try {
            if (result?.downloadFile && result?.pathFile) {
                res.download(pathFile, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    fs.unlink(pathFile);
                });
            } else if (result?.success) {
                res.status(200).json(this.responseResult(
                    true,
                    result?.message?.[locale] ?? this.messages.SUCCESS[locale] ?? null,
                    result?.data
                ));
            } else {
                res.status(result?.code ?? 500).json(this.responseResult(
                    false,
                    result?.message?.[locale] ?? result?.message ?? null,
                    result?.data
                ));
            }
        } catch (error) {
            this.logger.debug('Process Response Error', error);
        }
    }
}

export default BaseController;
