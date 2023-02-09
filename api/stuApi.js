const {pool, router, resJson} = require('../connect.js')
const {callBackSuc, callBackError} = require('../utils/utils.js')
const userSQL = require('../db/studentSql.js')
const code = -1

/**
 * 查询所有用户
 */
router.get('/queryAll', (req, res) => {
    let _data;
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryAll, (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result && result.length) {
                _data = callBackSuc('查询成功', result)
            } else {
                _data = callBackError(code, '当前没有用户')
            }
            resJson(res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 用户登录功能
 */
router.post('/login', (req, res) => {
    let user = {
        username: req.body.username,
        password: req.body.password
    }
    let _res = res;
    // 判断参数是否为空
    if (!user.username) {
        return resJson(_res, callBackError(code, '用户名不能为空'))
    }
    if (!user.password) {
        return resJson(_res, callBackError(code, '密码不能为空'))
    }
    let _data;
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        conn.query(userSQL.queryByNamePassword, [user.username, user.password], (e, result) => {
            if (e) _data = callBackError(code, e)
            //通过用户名和密码索引查询数据，有数据说明用户存在且密码正确，只能返回登录成功，否则返回用户名不存在或登录密码错误
            if (result && result.length) {
                _data = callBackSuc('登录成功', {userInfo: {username: user.username}})
            } else {
                _data = callBackError(code, '用户名不存在或登录密码错误')
            }
            resJson(_res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})

/**
 * 注册用户功能
 */
router.post('/register', (req, res) => {
    // 获取前台页面传过来的参数
    let user = {
        username: req.body.username,
        realname: req.body.realname,
        password: req.body.password
    }
    let _res = res;
    console.log('调用', req.body, req.body.username)
    // 判断参数是否为空
    if (!user.username) {
        return resJson(_res, callBackError(code, '用户名不能为空'))
    }
    if (!user.realname) {
        return resJson(_res, callBackError(code, '真实姓名不能为空'))
    }
    if (!user.password) {
        return resJson(_res, callBackError(code, '密码不能为空'))
    }
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(userSQL.queryByName, user.username, (e, r) => {
            if (e) _data = callBackError(code, e.sqlMessage)
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户
                    _data = callBackError(code, '用户已存在')
                } else {
                    //插入用户信息
                    user.create_time = new Date().getTime()
                    conn.query(userSQL.insert, user, (err, result) => {
                        if (result) {
                            _data = callBackSuc('注册成功')
                        } else {
                            _data = callBackError(code, '注册失败')
                        }
                    })
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 修改密码
 */
router.post('/updatePassword', (req, res) => {
    let user = {
        username: req.body.username,
        oldPassword: req.body.oldPassword,
        newPassword: req.body.newPassword,
        againPassword: req.body.againPassword
    }
    let _res = res;
    // 判断参数是否为空
    if (!user.username) {
        return resJson(_res, callBackError(code, '用户名不能为空'))
    }
    if (!user.oldPassword || !user.newPassword) {
        return resJson(_res, callBackError(code, '密码不能为空'))
    }
    if (!user.againPassword || user.againPassword !== user.newPassword) {
        return resJson(_res, callBackError(code, '请确认新密码或两次新密码不一致'))
    }
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(userSQL.queryByNamePassword, [user.username, user.oldPassword], (e, r) => {
            if (e) _data = callBackError(code, e)
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户且密码正确
                    conn.query(userSQL.updateUser, [{
                        password: user.newPassword
                    }, user.username], (err, result) => {
                        console.log(err)
                        if (result) {
                            _data = callBackSuc('修改密码成功')
                        } else {
                            _data = callBackError(code, '密码修改失败')
                        }
                    })
                } else {
                    _data = callBackError(code, '用户不存在或旧密码输入错误')
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 删除用户
 */
router.post('/deleteUser', (req, res) => {
    // 获取前台页面传过来的参数
    let user = {
        username: req.body.username
    }
    let _res = res;
    // 判断参数是否为空
    if (!user.username) {
        return resJson(_res, {
            code: -1,
            msg: '用户名不能为空'
        })
    }
    let _data;
    // 整合参数
    // 从连接池获取连接
    pool.getConnection((err, conn) => {
        // 查询数据库该用户是否已存在
        conn.query(userSQL.queryByName, user.username, (e, r) => {
            if (e) _data = {
                code: -1,
                msg: e
            }
            if (r) {
                //判断用户列表是否为空
                if (r.length) {
                    //如不为空，则说明存在此用户
                    conn.query(userSQL.deleteUser, user.username, (err, result) => {
                        if (err) _data = {
                            code: -1,
                            msg: e
                        }
                        if (result) {
                            _data = {
                                msg: '删除用户操作成功'
                            }
                        }
                    })
                } else {
                    _data = {
                        code: -1,
                        msg: '用户不存在，操作失败'
                    }
                }
            }
            setTimeout(() => {
                //把操作结果返回给前台页面
                resJson(_res, _data)
            }, 200);
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
module.exports = router;

