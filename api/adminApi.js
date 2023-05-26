const {router} = require('../connect.js')
const {pagination, basePost} = require('../utils/utils.js')
const {adminSQL} = require('../db/adminSql')
const {pool, resJson} = require("../connect");
const {getTimeForYMD} = require("../utils/date-util");
const {callBackError, callBackSuc, checkPermission, basePostByDelete} = require("../utils/utils");

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
/**
 * 添加管理员
 */
router.post('/addAdmin', (req, res) => {
    let _data;
    let body = req.body
    if (body.name && body.password && body.role && body.remark && body.user && body.currentRole) {
        pool.getConnection((err, conn) => {
            conn.query("select Id from na_admin where name = '" + body.name + "'", (e, result) => {
                if (result && result.length > 0) {
                    _data = callBackError(-1, '添加失败，账号重复')
                    resJson(res, _data)
                } else {
                    // 根据传过来账号匹配权限，只有超级管理员能创建超管、普管
                    checkPermission ({name: body.user, role: body.currentRole}, function (response) {
                        if (response.code === 200) {
                            // 进行添加
                            let param = [body.name, response.data, body.role, 1, body.remark, getTimeForYMD(), body.user]
                            conn.query(adminSQL.addAdmin, param, (e, result1) => {
                                if (result1) {
                                    _data = callBackSuc('添加成功')
                                } else {
                                    _data = callBackError(-1, '添加失败，请联系管理员')
                                }
                                resJson(res, _data)
                            })
                        } else if (res.code === 201) {
                            _data = callBackError(-1, '账号权限不够，请联系超级管理员')
                        }
                    })
                }
            })

            pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
        })
    } else {
        _data = callBackError(code, '信息不全，添加失败')
        resJson(res, _data)
    }
})

router.post('/delAdmin', (req, res) => {
    let params = {
        res: res,
        sql: adminSQL.delStu,
        param: req.body.ids
    }

    basePostByDelete(params)
})

module.exports = router;
