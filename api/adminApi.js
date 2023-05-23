const {router} = require('../connect.js')
const {pagination, basePost} = require('../utils/utils.js')
const {adminSQL} = require('../db/adminSql')

/**
 * 查询所有管理员
 */
router.post('/getAdminInfo', (req, res) => {
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    let params = {
        res: res,
        sql: adminSQL.getAdminInfo + limit,
        sql2: adminSQL.getAdminInfoTotal
    }
    basePost(params)
})
/**
 * 获取角色列表
 */
router.post('/getRoleList', (req, res) => {
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    let params = {
        res: res,
        sql: adminSQL.getRoleList + limit,
        sql2: adminSQL.getRoleTotal
    }
    basePost(params)
})

module.exports = router;
