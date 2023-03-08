/**
 * 返回成功信息
 * @param msg
 * @param data
 * @param total
 * @returns {{msg, code: number}}
 */
exports.callBackSuc = function (msg, data, total) {
    let obj = {
        code: 200,
        msg: msg
    }

    obj.data = data || []
    if (total) {
        obj.total = Object.values(total[0])[0]
    }
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

/**
 * 分页处理
 * @param no
 * @param size
 * @returns {string}
 */
exports.pagination = function (no, size) {
    let pageNo = Number(no) || 1
    let pageSize = Number(size) || 10
    let page = (pageNo - 1) * pageSize
    return ` limit ${page},${pageSize}`
}
