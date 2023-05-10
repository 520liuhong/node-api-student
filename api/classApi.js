const {router} = require('../connect.js')
const {basePost, pagination} = require('../utils/utils.js')
const {classSQL} = require('../db/classSql')
const {getTimeForYMD} = require("../utils/date-util");
const {callBackError} = require("../utils/utils");
const {resJson} = require("../connect");

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
    let updateTime = getTimeForYMD()
    if (body.user && body.id) {
        // 校验，年级只能降不能升，根据id查询到年级id进行校验
        // 添加校验，根据学院id匹配院系id，再匹配专业id和班级id，四者是否都能找到，如果匹配不上则不进行修改
        // 以上校验从业务方面出发，目前主要学习技术方面，故不深究
        let params = {
            res: res,
            sql: classSQL.updateClass,
            param: [body.gradeId, body.collegeId, body.specialtyId, body.classId, body.class, body.teacherId, updateTime, body.user, body.id]
        }
        basePost(params)
    } else {
        const _data = callBackError(code, 'Fail')
        resJson(res, _data)
    }
})

module.exports = router;
