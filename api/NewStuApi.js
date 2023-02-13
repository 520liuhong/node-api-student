const {pool, router, resJson} = require('../connect.js')
const {callBackSuc, callBackError} = require('../utils/utils.js')
const {stuSQL} = require('../db/studentSql.js')
const code = -1

/**
 * 查询所有用户
 */
router.get('/getAllStu', (req, res) => {
    let _data;
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getAllStu, (e, result) => {
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
 * 通过名称查询用户
 */
router.post('/getStuByName', (req, res) => {
    let _data;
    let param="%"+req.body.name+"%"

    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getStuByName, [param], (e, result) => {
            console.log('打印结果', result)
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
 * 查询所有院系
 */
router.get('/getAllCollege', (req, res) => {
    let _data;
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getAllCollege, (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result && result.length) {
                _data = callBackSuc('查询成功', result)
            } else {
                _data = callBackError(code, 'no data')
            }
            resJson(res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 查询所有班级
 */
router.get('/getAllClass', (req, res) => {
    let _data;
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getAllClass, (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result && result.length) {
                _data = callBackSuc('查询成功', result)
            } else {
                _data = callBackError(code, 'no data')
            }
            resJson(res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 根据院系查专业
 */
router.post('/getSpecialtyByCollege', (req, res) => {
    let _data;
    let param = req.body
    console.log('id', param)
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getSpecialtyByCollege, [param.college_id], (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result && result.length) {
                _data = callBackSuc('查询成功', result)
            } else {
                _data = callBackError(code, 'no data')
            }
            resJson(res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 根据专业查班级
 */
router.get('/getClassBySpecialty', (req, res) => {
    let _data;
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getClassBySpecialty, (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result && result.length) {
                _data = callBackSuc('查询成功', result)
            } else {
                _data = callBackError(code, 'no data')
            }
            resJson(res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
module.exports = router;

