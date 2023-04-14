const {pool, router, resJson} = require('../connect.js')
const {callBackSuc, callBackError, pagination} = require('../utils/utils.js')
const {classSQL} = require('../db/classSql')
const code = -1

const basePost = (res, sql, params) => {
    let _data;
    pool.getConnection((err, conn) => {
        conn.query(sql, params, (e, result) => {
            if (e) _data = callBackError(code, e)
            if (result) {
                _data = callBackSuc('删除成功')
            } else {
                _data = callBackError(code, '删除失败')
            }
            resJson(res, _data)
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
}
/**
 * 分页查询所有班级
 */
router.post('/getClass', (req, res) => {
    let _data;
    let limit = pagination(req.body.pageNo, req.body.pageSize)
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
/**
 * 删除班级
 */
router.post('/delClass', (req, res) => {
    let param = [req.body.ids]
    basePost(res, classSQL.delClass, param)
})

module.exports = router;
