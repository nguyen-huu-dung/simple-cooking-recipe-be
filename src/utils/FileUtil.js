import fs from 'fs';
import { FILE_PATH } from '../middlewares/upload';
import { LoggerError } from '../helpers/logger';

class FileUtil {

    constructor() {
        // path file
        this.filePath = FILE_PATH;
        // logger
        this.logger = LoggerError;
    }

    deleteFileIfExist(path) {
        if (path && fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    }
}

export default FileUtil;
