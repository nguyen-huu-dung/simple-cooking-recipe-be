import BaseService from './BaseService';
import { sign, verify } from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import slugify from 'slugify';
import Regex from '../utils/Regex';
import CryptoJS from 'crypto-js';

class HelperService extends BaseService {

    constructor() {
        super();
        // utils
        this.regex = Regex;
    }

    async asyncGenerateCode(
        repositoryInstance,
        firstCode = '',
        alphabet = this.constants.ALPHABET_GENERATE_UUID.LOW_ALPHABET_NUMBER,
        size = 12,
        maxLoop = 10
    ) {
        if (!repositoryInstance) return `${firstCode}${Date.now()}`;
        const numberDigitsAfter = size - firstCode.length;

        const digitsAfter = this.generateUuidAlphabet(alphabet, numberDigitsAfter);
        let code = `${firstCode}${digitsAfter}`;

        // check code exist
        const existedCode = await repositoryInstance.findOne({
            code
        }, {
            searchAll: true,
            attributes: ['code']
        });

        if (maxLoop === 0) return `${firstCode}${Date.now()}`;

        if (existedCode) {
            code = await this.asyncGenerateCode(repositoryInstance, firstCode, alphabet, size, maxLoop - 1);
        }

        return code;
    }

    generateSlug(string) {
        return slugify(string, {
            replacement: '-',
            lower: true,
            strict: true,
            trim: true,
            locale: 'vi'
        });
    }

    getCodeFromSlug(slug) {
        if (slug && (slug instanceof String || typeof slug === 'string')) {
            const slugs = slug.split('-');
            return slugs[slugs.length - 1];
        }
        return null;
    }

    generateUuidAlphabet(alphabet = this.constants.ALPHABET_GENERATE_UUID.ALPHABET_NUMBER, size = 3) {
        const newNanoid = customAlphabet(alphabet, size);
        return newNanoid();
    }

    generateOTP(alphabet = this.constants.ALPHABET_GENERATE_UUID.NUMBER, size = 6) {
        return this.generateUuidAlphabet(alphabet, size);
    }

    generateUuidWithJSONWebToken(payload, time) {
        if (!payload) return null;
        const uuid = sign(payload, this.jwtSecret, {
            ...time ?
                {
                    expiresIn: time
                } :
                {},
            algorithm: this.jwtAlgorithm
        });

        return uuid;
    }

    verifyUuidWithJSONWebToken(uuid) {
        try {
            if (!uuid) return null;

            const data = verify(uuid, this.jwtSecret);

            return data;
        } catch (error) {
            return null;
        }
    }

    generateUuidWithCryptoJS(payload, time) {
        if (!payload) return null;

        const uuid = CryptoJS.AES.encrypt(JSON.stringify({
            data: payload,
            isExpirationTime: time ? true : false,
            expirationTime: time ?
                this.generateUuidWithJSONWebToken({
                    time
                }, time) :
                null
        }), this.jwtSecret).toString();

        return encodeURIComponent(uuid);
    }

    verifyUuidWithCryptoJS(uuid) {
        try {
            if (!uuid) return null;

            const bytes = CryptoJS.AES.decrypt(decodeURIComponent(uuid), this.jwtSecret);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            if (decryptedData.isExpirationTime) {
                const verifyTime = this.verifyUuidWithJSONWebToken(decryptedData.expirationTime);

                if (!verifyTime) {
                    throw new Error('expire uuid');
                }
            }

            const data = decryptedData.data;

            return data;
        } catch (error) {
            return null;
        }
    }
}

export default HelperService;
