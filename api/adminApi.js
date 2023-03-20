const {pool, router, resJson} = require('../connect.js')
const {callBackSuc, callBackError, pagination} = require('../utils/utils.js')
const {adminSQL} = require('../db/adminSql')
const code = -1

/**
 * 查询所有管理员
 */
router.post('/getAdminInfo', (req, res) => {
    let _data;
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    pool.getConnection((err, conn) => {
        conn.query(adminSQL.getAdminInfo + limit, (e, result) => {
            conn.query(adminSQL.getAdminInfoTotal, (e1, result1) => {
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

module.exports = router;
