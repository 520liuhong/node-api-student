const {router} = require('../connect.js')
const {basePost, pagination} = require('../utils/utils.js')
const {classSQL} = require('../db/classSql')
const {getTimeForYMD} = require("../utils/date-util");
const {callBackError, callBackSuc, basePostByDelete} = require("../utils/utils");
const {resJson, pool} = require("../connect");

/**
 * 分页查询所有班级
 */
router.post('/getClass', (req, res) => {
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    let params = {
        res: res,
        sql: classSQL.getClass + limit,
        sql2: classSQL.getClassTotal,
    }
    if (req.body.q) {
        let param = "%" + req.body.q + "%"
        params = {
            res: res,
            sql: classSQL.searchClass + limit,
            param: [param],
            sql2: classSQL.searchClassTotal,
            param2: [param]
        }
    }
    basePost(params)
})
/**
 * 获取教师列表，目前支持查询所有教师，根据学院，或院系查找教师等三种情况
 */
router.post('/getTeacher', (req, res) => {
    let limit = pagination(req.body.pageNo, req.body.pageSize)

    let params = {
        res: res,
        sql: classSQL.getTeacher + limit,
        sql2: classSQL.getTeacherTotal
    }

    if (req.body.collegeId) {
        params = {
            res: res,
            sql: classSQL.getTeacherByCollege + limit,
            param: req.body.collegeId,
            sql2: classSQL.getTeacherTotal+' college_id='+req.body.collegeId,
            param2: req.body.collegeId
        }
    } else if (req.body.specialtyId) {
        params = {
            res: res,
            sql: classSQL.getTeacherBySpecialty + limit,
            param: req.body.specialtyId,
            sql2: classSQL.getTeacherTotal+' specialty_id_id='+req.body.specialtyId,
            param2: req.body.specialtyId
        }
    }

    basePost(params)
})
/**
 * 新增班级
 */
router.post('/addClass', (req, res) => {
    let _data;
    let body = req.body
    if (body.gradeId && body.collegeId && body.specialtyId && body.teacherId && body.class && body.user) {
        pool.getConnection((err, conn) => {
            let class_id = 0
            conn.query('select max(class_id) as id from na_class where grade_id = '+body.gradeId+' and specialty_id = '+body.specialtyId+' order by class_id desc', (e, result) => {
                // 创建班级id
                if (result && result.length > 0) {
                    class_id = parseFloat(result[0].id) +1
                } else {
                    conn.query('select grade_name as year from na_grade where grade_id = '+body.gradeId, (e1, result1) => {
                        if (result && result.length > 0) {
                            const year = result[0].year
                            class_id = year + body.specialtyId + '01'
                            class_id = parseFloat(class_id)
                        } else {
                            // 否则使用当前年份当作年级年份
                            class_id = 2023 + body.specialtyId + '01'
                            class_id = parseFloat(class_id)
                        }
                    })
                }

                let param = [body.gradeId, body.collegeId, body.specialtyId, class_id,body.class,body.teacherId, getTimeForYMD(), body.user]
                conn.query(classSQL.addClass, param, (e, result1) => {
                    if (result1) {
                        _data = callBackSuc('添加成功')
                    } else {
                        _data = callBackError(-1, '添加失败，请联系管理员')
                    }
                    resJson(res, _data)
                })
            })

            pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
        })
    } else {
        _data = callBackError('-1', '信息不全，添加失败')
        resJson(res, _data)
    }
})
/**
 * 删除班级
 */
router.post('/delClass', (req, res) => {
    let params = {
        res: res,
        sql: classSQL.delClass,
        param: req.body.ids
    }
    basePostByDelete(params)
})
/** 修改班级信息 */
router.post('/updateClass', (req, res) => {
    let body = req.body
    if (body.user && body.id) {
        // 班级信息只能修改班主任，查询选择的班主任是否在本专业，若在则更改
        pool.getConnection((err, conn) => {
            conn.query(classSQL.getTeacherIdBySpecialty, [body.specialtyId,body.teacherId], (e, result) => {
                if (result && result.length > 0) {
                    let updateTime = getTimeForYMD()
                    let params = {
                        res: res,
                        sql: classSQL.updateClass,
                        param: [body.teacherId, updateTime, body.user, body.id]
                    }
                    basePost(params)
                } else {
                    const _data = callBackError('-1', '操作失败，选择教师不在本专业')
                    resJson(res, _data)
                }
            })
        })
    } else {
        const _data = callBackError('-1', '操作失败，用户信息不完整')
        resJson(res, _data)
    }
})

module.exports = router;
