/**
 * @name: 组件库
 * @description: 组件库
 * @author: newhome
 * @date: 2023-02-09 17:56:50
 */

const {pool, resJson} = require("../connect");
const code = -1
// 引入 crypto
const crypto = require("crypto");

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
                    if (result) {
                        _data = callBackSuc('OK', result, result1)
                    } else {
                        _data = callBackError(code, 'Fail')
                    }
                    resJson(res, _data)
                })
            } else {
                if (e) _data = callBackError(code, e)
                if (result) {
                    _data = callBackSuc('OK', result)
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
        obj.total = total[0].total
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

/**
 * @name: 定义加密方法
 * @description:
 * @author: newhome
 * @date: 2023-05-24 17:58:21
 */
exports.aesEncrypt = function (data, callBack) {
    if (data) {
        pool.getConnection((err, conn) => {
            conn.query('select * from na_crypto', (e, result) => {
                if (result && result.length > 0) {
                    // 三个参数：加密的key、加密的iv、需要加密的数据
                    const key = result[0].key
                    const iv = result[0].iv
                    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
                    let crypted = cipher.update(data, "binary", "hex");
                    // 加密结束：结尾加上 cipher.final('hex') 表示结束
                    crypted += cipher.final("hex");

                    callBack({code: 200, data: crypted})
                } else {
                    callBack({code: -1, msg: '加密文件为空，请检查数据库'})
                }
            })
            pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
        })
    } else {
        callBack({code: -1, msg: '密码不可为空'})
    }
}
/**
 * 定义解密方法
 * @param key
 * @param iv
 * @param crypted
 * @returns {string}
 */
exports.aesDecrypt = function (key, iv, crypted) {
    // 转换解密数据：把需要解密的数据，转化成 buffer 格式，再转换成二进制
    crypted = Buffer.from(crypted, "hex").toString("binary");
    // 创建解密对象
    const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
    // 开始解密：三个参数（要解密的数据、解密前的数据类型以及解密后的数据格式）
    let decrypted = decipher.update(crypted, "binary", "utf8");
    // 解密结束
    decrypted += decipher.final("utf8");

    // 返回明文
    return decrypted;
}
