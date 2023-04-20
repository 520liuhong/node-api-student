const {router} = require('../connect.js')
const {pagination} = require('../utils/utils.js')
const {adminSQL} = require('../db/adminSql')
const {basePost} = require("../utils/utils");

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

module.exports = router;
