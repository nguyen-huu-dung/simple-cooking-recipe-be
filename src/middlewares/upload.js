import multer from 'multer';
import Constants from '../utils/Constants';
import { extname } from 'path';
import { customAlphabet } from 'nanoid';
import Messages from '../utils/Messages';
import ResponseUtil from '../utils/ResponseUtil';

const responseResult = new ResponseUtil().responseResult;

export const FILE_PATH = `${process.cwd()}/files`;
export const MAX_SIZE = 5 * 1024 * 1024; // tối đa 5MB
export const ALLOWED_MIME_TYPES = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/webp'
];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, FILE_PATH);
    },
    filename: function (req, file, cb) {
        // eslint-disable-next-line @stylistic/js/max-len
        cb(null, `${customAlphabet(Constants.ALPHABET_GENERATE_UUID.ALPHABET_NUMBER, 12)()}_${Date.now()}${extname(file.originalname).toLowerCase()}`);
    }
});

const uploadImage = multer({
    storage: storage,
    limits: {
        fileSize: MAX_SIZE // Giới hạn kích thước file
    },
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
            return cb(new Error(Messages.IMAGE_FORMAT_INVALID));
        }
        cb(null, true);
    }
});

export const uploadSingleImage = (fieldName) => (req, res, next) => {
    uploadImage.single(fieldName)(req, res, (err) => {
        if (err) {
            let errorMessage;
            if (err instanceof multer.MulterError) {
                // Kiểm tra lỗi do multer
                if (err.code === 'LIMIT_FILE_SIZE') {
                    errorMessage = Messages.IMAGE_SIZE_INVALID;
                }
            } else if (err) {
                errorMessage = err.message;
            }

            if (errorMessage) {
                return res.status(400).json(responseResult(
                    false,
                    err.message?.[req?.headers?.locale] ?? err.message,
                    null
                ));
            }
        }
        next();
    });
};
