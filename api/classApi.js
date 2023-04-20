const {router} = require('../connect.js')
const {basePost, pagination} = require('../utils/utils.js')
const {classSQL} = require('../db/classSql')

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
 * 获取教师列表
 */
router.post('/getTeacher', (req, res) => {
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    let params = {
        res: res,
        sql: classSQL.getTeacher + limit,
        sql2: classSQL.getTeacherTotal,
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

module.exports = router;
