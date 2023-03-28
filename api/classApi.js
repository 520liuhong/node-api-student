const {pool, router, resJson} = require('../connect.js')
const {callBackSuc, callBackError, pagination} = require('../utils/utils.js')
const {classSQL} = require('../db/classSql')
const code = -1

/**
 * 分页查询所有班级
 */
router.post('/getClass', (req, res) => {
    let _data;
    let limit = pagination(req.body.pageNo, req.body.pageSize)
    console.log(classSQL.getClass)
    pool.getConnection((err, conn) => {
        conn.query(classSQL.getClass + limit, (e, result) => {
            conn.query(classSQL.getClassTotal, (e1, result1) => {
                if (e) _data = callBackError(code, e)
                if (result && result.length) {
                    _data = callBackSuc('查询成功', result, result1)
                } else {
                    _data = callBackError(code, '当前没有数据')
                }
                resJson(res, _data)
            })
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})

module.exports = router;
