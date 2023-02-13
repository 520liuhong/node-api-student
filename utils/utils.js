/**
 * 返回成功信息
 * @param msg
 * @param data
 * @returns {{msg, code: number}}
 */
exports.callBackSuc = function (msg, data) {
    let obj = {
        code: 200,
        msg: msg
    }
    if (data) obj.data = data
    return obj
}

/**
 * 返回失败信息
 * @param code
 * @param msg
 * @returns {{msg, code: number}}
 */
exports.callBackError = function (code, msg) {
    return {
        code: code || -1,
        msg: msg || 'no data'
    }
}
