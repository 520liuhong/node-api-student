const {pool, router, resJson} = require('../connect.js')
const {callBackSuc, callBackError, pagination} = require('../utils/utils.js')
const {stuSQL} = require('../db/studentSql.js')
const code = -1

/**
 * 查询所有学生
 */
router.post('/getStuInfo', (req, res) => {
    let _data;
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getStuInfo + limit, (e, result) => {
            conn.query('select count(Id) from na_student', (e1, result1) => {
                if (e) _data = callBackError(code, e)
                if (result && result.length) {
                    _data = callBackSuc('查询成功', result, result1)
                } else {
                    _data = callBackError(code, '当前没有用户')
                }
                resJson(res, _data)
            })
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 通过名称或者学号模糊查询学生
 */
router.post('/getStuByNameOrId', (req, res) => {
    let _data;
    let param = "%" + req.body.q + "%"
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getStuByNameOrId + limit, [param], (e, result) => {
            conn.query(stuSQL.getStuByNameOrIdTotal, [param], (e1, result1) => {
                if (e) _data = callBackError(code, e)
                if (result && result.length) {
                    _data = callBackSuc('查询成功', result, result1)
                } else {
                    _data = callBackError(code, '未查询到该用户')
                }
                resJson(res, _data)
            })
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
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getSpecialtyByCollege, [param.id], (e, result) => {
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
router.post('/getClassBySpecialty', (req, res) => {
    let _data;
    let param = req.body
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.getClassBySpecialty, [param.id], (e, result) => {
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
 * 注册学生信息
 */
router.post('/addStu', (req, res) => {
    let _data;
    let body = req.body
    pool.getConnection((err, conn) => {
        let stu_id = 0
        conn.query('select max(stu_id) from na_student where class_id = ' + body.classId + ' order by stu_id desc', (e, result) => {
            stu_id = Object.values(result[0])[0]
            if (stu_id) {
                stu_id = parseFloat(stu_id) + 1
            } else {
                stu_id = body.classId + '01'
            }
            let param = [body.collegeId, body.specialtyId, body.classId, stu_id, body.name, body.sex, body.age, body.address, body.phoneNo, (new Date()).getTime()]
            conn.query(stuSQL.addStu, param, (e, result1) => {
                if (e) _data = callBackError(code, e)
                if (result1) {
                    _data = callBackSuc('添加成功')
                } else {
                    _data = callBackError(code, '添加失败，请联系管理员')
                }
                resJson(res, _data)
            })
        })

        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 删除学生信息
 */
router.post('/delStu', (req, res) => {
    let _data;
    let param = [req.body.ids]
    pool.getConnection((err, conn) => {
        conn.query(stuSQL.delStu, param, (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result) {
                _data = callBackSuc('删除成功')
            } else {
                _data = callBackError(code, '删除失败')
            }
            resJson(res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
/**
 * 修改学生信息
 */
router.post('/updateStu', (req, res) => {
    let _data;
    let body = req.body
    let updateTime = (new Date()).getTime()
    pool.getConnection((err, conn) => {
        let param = [body.collegeId, body.specialtyId, body.classId, body.stuId, body.name, body.sex, body.age, body.address, body.phoneNo, updateTime, body.user, body.id]
        conn.query(stuSQL.updateStu, param, (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result) {
                _data = callBackSuc('修改成功')
            } else {
                _data = callBackError(code, '修改失败，请联系管理员')
            }
            resJson(res, _data)
        })

        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})

module.exports = router;

