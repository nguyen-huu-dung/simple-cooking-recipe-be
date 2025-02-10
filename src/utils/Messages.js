import Constants from './Constants';

class Messages {

    // common
    SERVER_ERROR = {
        [Constants.LANGUAGE.vi]: 'Đã xảy ra lỗi trên máy chủ!'
    };

    BAD_REQUEST = {
        [Constants.LANGUAGE.vi]: 'Yêu cầu không hợp lệ!'
    };

    CREATE_SUCCESS = {
        [Constants.LANGUAGE.vi]: 'Tạo thành công!'
    };

    UPDATE_SUCCESS = {
        [Constants.LANGUAGE.vi]: 'Cập nhật thành công!'
    };

    DELETE_SUCCESS = {
        [Constants.LANGUAGE.vi]: 'Xóa thành công!'
    };

    SUCCESS = {
        [Constants.LANGUAGE.vi]: 'Thành công!'
    };

    ERROR = {
        [Constants.LANGUAGE.vi]: 'Lỗi!'
    };

    // login
    EMAIL_INVALID = {
        [Constants.LANGUAGE.vi]: 'Địa chỉ email không hợp lệ.'
    };

    EMAIL_BLOCK = {
        [Constants.LANGUAGE.vi]: 'Địa chỉ email đã bị khóa.'
    };

    CONFIRM_SIGN_IN_WITH_OTP_INVALID = {
        [Constants.LANGUAGE.vi]: 'Mã xác nhận không đúng hoặc đã hết hạn.'
    };

    TOKEN_EXPIRE = {
        [Constants.LANGUAGE.vi]: 'Phiên đăng nhập đã hết hạn. Xin vui lòng đăng nhập lại.'
    };

    // cooking recipe
    IMAGE_FORMAT_INVALID = {
        [Constants.LANGUAGE.vi]: 'Định dạng ảnh không hợp lệ! Chỉ hỗ trợ JPG, JPEG, PNG, WEBP.'
    };

    IMAGE_SIZE_INVALID = {
        [Constants.LANGUAGE.vi]: 'Ảnh có kích thước tối đa là 5MB.'
    };

    COOKING_RECIPE_MENU_INVALID = {
        [Constants.LANGUAGE.vi]: 'Thực đơn không hợp lệ.'
    };

    COOKING_RECIPE_TYPE_DISH_INVALID = {
        [Constants.LANGUAGE.vi]: 'Loại món ăn không hợp lệ.'
    };

    COOKING_RECIPE_MAKE_WAY_INVALID = {
        [Constants.LANGUAGE.vi]: 'Cách thực hiện không hợp lệ.'
    };

    COOKING_RECIPE_NOT_EXISTED = {
        [Constants.LANGUAGE.vi]: 'Công thức nấu ăn không tồn tại.'
    };
}

export default new Messages();
