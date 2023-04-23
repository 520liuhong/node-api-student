const {router} = require('../connect.js')
const {basePost, pagination} = require('../utils/utils.js')
const {classSQL} = require('../db/classSql')
const {getTimeForYMD} = require("../utils/date-util");

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
    let params = {
        res: res,
        sql: classSQL.delClass,
        param: [req.body.ids]
    }
    basePost(params)
})
/** 修改班级信息 */
router.post('/updateClass', (req, res) => {
    let body = req.body
    let updateTime = getTimeForYMD()
    let params = {
        res: res,
        sql: classSQL.updateClass,
        param: [body.gradeId, body.collegeId, body.specialtyId, body.classId, body.class, body.teacherId, updateTime, body.user, body.id]
    }
    basePost(params)
})

module.exports = router;
