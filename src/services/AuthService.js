import BaseService from './BaseService';
import { UserModel } from '../models';
import { TokenRepository, UserRepository } from '../repositories';
import HelperService from './HelperService';
import MailService from './MailService';

class AuthService extends BaseService {

    constructor() {
        super();
        // service
        this.helperService = new HelperService();
        this.mailService = new MailService();
        // repository
        this.tokenRepository = new TokenRepository();
        this.userRepository = new UserRepository();
    }

    async asyncSignInWithOTP(payload) {

        const { email } = payload;

        // kiểm tra địa chỉ email
        const existedEmail = await this.userRepository.findOne({
            email
        }, {
            attributes: [
                'email',
                'status',
                'delete_flag'
            ]
        });

        // kiểm tra trạng thái tài khoản
        if (existedEmail && existedEmail.status !== this.constants.STATUS.ACTIVE) {
            return this.result(false, 400, this.messages.EMAIL_BLOCK);
        }

        // tạo mã xác nhận
        const otp = this.helperService.generateOTP();

        // tạo uuid
        const uuid = this.helperService.generateUuidWithCryptoJS({
            email,
            otp
        }, this.config.get('durationExpire.signInWithOTP'));

        // gửi mã xác nhận đến email của người dùng
        this.mailService.asyncSendMail({
            to: email,
            subject: 'Mã xác nhận đăng nhập hệ thống Cooking Recipe',
            html: `
                <div>
                    Bạn đang yêu cầu đăng nhập vào hệ thống Cooking Recipe!
                </div>
                <br/>
                <div>
                    Mã xác nhận: ${otp}
                </div>
                <br/>
                <div>
                    Lưu ý: Mã xác nhận có hiệu lực trong vòng 5 phút.
                </div>
            `
        });

        // trả về kết quả
        const result = {
            uuid
        };

        return this.result(true, 200, null, result);
    }

    async asyncConfirmSignInWithOTP(payload) {
        const { uuid, confirmOTP } = payload;

        // kiếm tra uuid
        const verifyUuid = this.helperService.verifyUuidWithCryptoJS(uuid);
        if (!verifyUuid) {
            return this.result(false, 400, this.messages.CONFIRM_SIGN_IN_WITH_OTP_INVALID);
        }

        // kiểm tra otp
        const { otp, email } = verifyUuid;
        if (otp !== confirmOTP) {
            return this.result(false, 400, this.messages.CONFIRM_SIGN_IN_WITH_OTP_INVALID);
        }

        // kiểm tra email đã tồn tại chưa
        const existedEmail = await this.userRepository.findOne({
            email
        });

        // Nếu đã có tài khoản
        let user;
        if (existedEmail) {
            // kiểm tra trạng thái tài khoản
            if (existedEmail.status !== this.constants.STATUS.ACTIVE) {
                return this.result(false, 400, this.messages.EMAIL_BLOCK);
            }

            user = existedEmail;
        } else {
            // Tạo tài khoản mới nếu chưa có email trên
            // Tạo mã định danh cho tài khoản
            const code = await this.helperService.asyncGenerateCode(this.userRepository, this.constants.CODE_MODEL.USER.FIRST_CODE);
            user = await this.userRepository.create({
                code,
                email,
                status: this.constants.STATUS.ACTIVE
            });
        }

        // tạo token
        const token = this.helperService.generateUuidWithJSONWebToken({
            code: user.code,
            email
        }, this.config.get('durationExpire.signIn'));

        // lưu token
        await this.tokenRepository.create({
            user_id: user.id,
            token
        });

        // trả về kết quả
        const result = {
            token
        };

        return this.result(true, 200, null, result);
    }

    async asyncAuthorization(payload) {
        const { decode, token } = payload;
        const { code } = decode;

        // kiểm tra token và user
        const existedToken = await this.tokenRepository.findOne({
            token
        }, {
            includes: [
                {
                    model: UserModel,
                    where: {
                        code,
                        status: this.constants.STATUS.ACTIVE
                    },
                    required: true,
                    as: 'user'
                }
            ]
        });
        if (!existedToken) return this.result(false, 403, this.messages.TOKEN_EXPIRE);

        // trả về dữ liệu
        const result = {
            user: existedToken.user
        };

        return this.result(true, 200, null, result);
    }

    async asyncSignOut(token) {
        await this.tokenRepository.deleteByFlag({
            token
        });

        return this.result(true, 200, this.messages.SUCCESS);
    }

    async asyncUpdateProfile(payload) {
        const { fullName, gender, birthday, userId } = payload;

        // cập nhật profile
        await this.userRepository.update({
            options: {
                id: userId
            },
            data: {
                full_name: fullName || null,
                gender: gender || null,
                birthday: birthday || null
            }
        });

        return this.result(true, 200, this.messages.UPDATE_SUCCESS);
    }
}

export default AuthService;
