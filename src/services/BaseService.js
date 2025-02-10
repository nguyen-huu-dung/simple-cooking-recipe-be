import 'dotenv/config';
import ResponseUtil from '../utils/ResponseUtil';
import Constants from '../utils/Constants';
import Messages from '../utils/Messages';
import config from 'config';
import { FILE_PATH } from '../middlewares/upload';

class BaseService {

    constructor() {
        // env
        this.jwtSecret = process.env.JWT_SECRET;
        this.jwtAlgorithm = process.env.JWT_ALGORITHM;
        this.saltRounds = process.env.SALT_ROUNDS;
        // config
        this.config = config;
        // utils
        this.constants = Constants;
        this.messages = Messages;
        this.filePath = FILE_PATH;
        // result
        this.result = new ResponseUtil().result;
    }
}

export default BaseService;
