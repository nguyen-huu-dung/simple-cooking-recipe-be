class ResponseUtil {

    result(isSuccess = false, statusCode = 400, message = null, data = null) {
        return {
            success: isSuccess,
            code: statusCode,
            message: message,
            data: data
        };
    }

    responseResult(ok = false, message = null, data = null) {
        return {
            ok,
            message,
            data
        };
    }

}

export default ResponseUtil;
