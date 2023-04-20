/**
 * @name: 组件库
 * @description: 组件库
 * @author: newhome
 * @date: 2023-02-09 17:56:50
 */

const {pool, resJson} = require("../connect");
const code = -1

/**
 * 统一的数据库连接
 * @param params
 */
exports.basePost = (params) => {
    let _data;
    let {res, sql, sql2, param, param2} = params
    pool.getConnection((err, conn) => {
        conn.query(sql, param, (e, result) => {
            if (sql2) {
                conn.query(sql2, param2, (e1, result1) => {
                    if (e) _data = callBackError(code, e)
                    if (result && result.length) {
                        _data = callBackSuc('OK', result, result1)
                    } else {
                        _data = callBackError(code, 'Fail')
                    }
                    resJson(res, _data)
                })
            } else {
                if (e) _data = callBackError(code, e)
                if (result && result.length) {
                    _data = callBackSuc('OK')
                } else {
                    _data = callBackError(code, 'Fail')
                }
                resJson(res, _data)
            }
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
}
/**
 * 返回成功信息
 * @param msg
 * @param data
 * @param total
 * @returns {{msg, code: number}}
 */
const callBackSuc = function (msg, data, total) {
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
exports.callBackSuc = callBackSuc
/**
 * 返回失败信息
 * @param code
 * @param msg
 * @returns {{msg, code: number}}
 */
const callBackError = function (code, msg) {
    return {
        code: code || -1,
        msg: msg || 'no data'
    }
}
exports.callBackError = callBackError
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
