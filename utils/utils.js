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
 * @param msg
 * @returns {{msg, code: number}}
 */
exports.callBackError = function (e1, e2) {
    let obj = {}
    if (e2) {
        obj = {
            code:  e1,
            msg: e2 || '操作失败'
        }
    } else {
        obj = {
            code:  -1,
            msg: e1
        }
    }
    return obj
}
