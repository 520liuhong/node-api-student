const {router} = require('../connect.js')
const {basePost, pagination} = require('../utils/utils.js')
const {classSQL} = require('../db/classSql')
const {getTimeForYMD} = require("../utils/date-util");
const {callBackError} = require("../utils/utils");
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
 * 删除班级
 */
router.post('/delClass', (req, res) => {
    const idList = req.body.ids
    let params = {
        res: res,
        sql: classSQL.delClass,
        param: [idList]
    }
    if (idList && Array.isArray(idList)) {
        let flag = false
        for (let i = 0;i < idList.length;i++) {
            if (typeof idList[i] === "number") {
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
