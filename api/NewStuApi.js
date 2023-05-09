const {pool, router, resJson} = require('../connect.js')
const {callBackSuc, callBackError, pagination} = require('../utils/utils.js')
const {stuSQL} = require('../db/studentSql.js')
const {getTimeForYMD} = require("../utils/date-util");
const {basePost} = require("../utils/utils");
const code = -1

/**
 * 查询所有学生
 */
router.post('/getStuInfo', (req, res) => {
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    let params = {
        res: res,
        sql: stuSQL.getStuInfo + limit,
        sql2: stuSQL.getStuTotal,
    }
    basePost(params)
})
/**
 * 通过名称或者学号模糊查询学生
 */
router.post('/getStuByNameOrId', (req, res) => {
    let param = "%" + req.body.q + "%"
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    let params = {
        res: res,
        sql: stuSQL.getStuByNameOrId + limit,
        param: [param],
        sql2: stuSQL.getStuByNameOrIdTotal,
        param2: [param]
    }
    basePost(params)
})
/**
 * 查询所有院系
 */
router.get('/getAllCollege', (req, res) => {
    let params = {
        res: res,
        sql: stuSQL.getAllCollege
    }
    basePost(params)
})
/**
 * 查询所有班级
 */
router.get('/getAllClass', (req, res) => {
    let params = {
        res: res,
        sql: stuSQL.getAllClass
    }
    basePost(params)
})
/**
 * 根据院系查专业
 */
router.post('/getSpecialtyByCollege', (req, res) => {
    let params = {
        res: res,
        sql: stuSQL.getSpecialtyByCollege,
        param: [req.body.id]
    }
    if (req.body.id) {
        basePost(params)
    } else {
        const _data = callBackError(code, 'Fail')
        resJson(res, _data)
    }
})
/**
 * 根据专业查班级
 */
router.post('/getClassBySpecialty', (req, res) => {
    let params = {
        res: res,
        sql: stuSQL.getClassBySpecialty,
        param: [req.body.id]
    }
    if (req.body.id) {
        basePost(params)
    } else {
        const _data = callBackError(code, 'Fail')
        resJson(res, _data)
    }
})
/**
 * 注册学生信息
 */
router.post('/addStu', (req, res) => {
    let _data;
    let body = req.body
    if (body.classId && body.gradeId && body.collegeId && body.specialtyId && body.name && body.sex && body.birthday && body.age && body.address) {
        pool.getConnection((err, conn) => {
            let stu_id = 0
            conn.query('select max(stu_id) from na_student where class_id = ' + body.classId + ' order by stu_id desc', (e, result) => {
                stu_id = Object.values(result[0])[0]
                stu_id = stu_id ? parseFloat(stu_id) + 1 : body.classId + '01'

                let param = [body.gradeId, body.collegeId, body.specialtyId, body.classId, stu_id, body.name, body.sex, body.birthday, body.age, body.address, body.phoneNo, getTimeForYMD()]
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
    } else {
        _data = callBackError(code, '信息不全，添加失败')
        resJson(res, _data)
    }
})
/**
 * 删除学生信息
 */
router.post('/delStu', (req, res) => {
    const ids = req.body.ids
    let params = {
        res: res,
        sql: stuSQL.delStu,
        param: [ids]
    }

    if (ids && Array.isArray(ids)) {
        let flag = false
        for (let i = 0;i < ids.length;i++) {
            if (typeof ids[i] === "number") {
                flag = true
            } else {
                flag = false
                break
            }
        }
        if (flag) {
            basePost(params)
        } else {
            const _data = callBackError(code, '删除失败')
            resJson(res, _data)
        }
    } else {
        const _data = callBackError(code, '删除失败')
        resJson(res, _data)
    }
})
/**
 * 修改学生信息
 */
router.post('/updateStu', (req, res) => {
    let body = req.body
    let updateTime = getTimeForYMD()
    let params = {
        res: res,
        sql: stuSQL.updateStu,
        param: [body.gradeId, body.collegeId, body.specialtyId, body.classId, body.stuId, body.name, body.sex, body.birthday, body.age, body.address, body.phoneNo, updateTime, body.user, body.id]
    }
    basePost(params)
})
/**
 * 获取年级列表
 */
router.post('/getGrade', (req, res) => {
    let params = {
        res: res,
        sql: stuSQL.getGrade
    }
    basePost(params)
})

module.exports = router;
