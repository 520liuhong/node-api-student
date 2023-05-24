const {router} = require('../connect.js')
const {aesEncrypt, callBackError} = require("../utils/utils");
const {resJson, pool} = require("../connect");
const {getTimeForYMD} = require("../utils/date-util");

/**
 * 登录
 * 用户名密码不可为空，在用户表查到该用户后，查询配置表na_crypto，对密码进行加密，并对比用户表中的密码
 * 如果密码一致，则登录成功，并将此刻作为登陆时间，否则提示登录失败
 */
router.post('/login', (req, res) => {
    let _data;
    const name = req.body.name
    const pwd = req.body.password

    if (name && pwd && name !== '' && pwd !== '') {
        pool.getConnection((err, conn) => {
            conn.query("select * from na_admin where name = '" + name + "'", (e1, result1) => {
                const myPwd = result1[0].password
                if (myPwd) {
                    aesEncrypt(pwd, function (response) {
                        if (response.code === 200) {
                            const newPwd = response.data
                            if (myPwd === newPwd) {
                                const loginTime = getTimeForYMD()
                                conn.query("update na_admin set last_login = '" + loginTime + "'", (e3, result3) => {
                                    if (!result3) {
                                        console.log('登录时修改时间失败', e3.sqlMessage)
                                    }
                                })
                                _data = {code: 200, msg: '登录成功'}
                                resJson(res, _data)
                            } else {
                                _data = callBackError('-1', '登录失败，请检查用户名或密码')
                                resJson(res, _data)
                            }
                        } else {
                            _data = callBackError(-2, '添加失败，请联系管理员')
                            resJson(res, _data)
                        }
                    })
                } else {
                    _data = callBackError('-1', '登录失败，请检查用户名或密码')
                    resJson(res, _data)
                }
            })
            pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
        })
    } else {
        _data = callBackError('-1', '用户名和密码不可为空')
        resJson(res, _data)
    }
})

module.exports = router;
