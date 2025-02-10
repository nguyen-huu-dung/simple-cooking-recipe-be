import 'dotenv/config';
import AWS from 'aws-sdk';
import fs from 'fs';
import { LoggerError } from '../helpers/logger';

class AWSService {

    constructor() {
        this.awsUseIamRole = process.env.AWS_USE_IAM_ROLE;
        this.accessKeyId = process.env.AWS_ACCESS_KEY;
        this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
        this.region = process.env.AWS_REGION;
        this.awsBucket = process.env.AWS_BUCKET;
        this.awsCloudfrontUrl = process.env.AWS_CLOUDFRONT_URL;
        this.awsCookingRecipeImage = process.env.AWS_COOKING_RECIPE_IMAGE;

        this.s3 = this.awsUseIamRole === 'TRUE' ?
            new AWS.S3() :
            new AWS.S3({
                credentials: {
                    accessKeyId: this.accessKeyId,
                    secretAccessKey: this.secretAccessKey
                },
                region: this.region
            });
    }

    async asyncPutObject(bucket, key, pathFile) {
        try {
            if (pathFile && fs.existsSync(pathFile)) {
                const file = fs.readFileSync(pathFile);
                await this.s3.putObject({
                    Bucket: bucket,
                    Key: key,
                    Body: file
                }).promise();
                return true;
            } else {
                return false;
            }
        } catch (error) {
            LoggerError.debug('AWS_PUT_OBJECT', error);
            return false;
        }
    }

    async asyncDeleteObject(bucket, key) {
        try {
            if (bucket && key) {
                await this.s3.deleteObject({
                    Bucket: bucket,
                    Key: key
                }).promise();
            }
        } catch (error) {
            LoggerError.debug('AWS_DELETE_OBJECT', error);
        }
    }

    generateFileUrl(path, filename) {
        if (!path || !filename) return null;
        if (this.awsCloudfrontUrl) {
            return `${this.awsCloudfrontUrl}/${path}/${filename}`;
        }
        return `https://s3.${this.region}.amazonaws.com/${this.awsBucket}/${path}/${filename}`;
    }

    getFilenameFromUrl(url) {
        if (!url || !(typeof url === 'string' || url instanceof String)) return null;
        return url.split('/').pop();
    }
}

export default AWSService;
