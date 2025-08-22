const {router} = require('../connect.js')
const {aesEncrypt, callBackError, callBackSuc} = require("../utils/utils");
const {resJson, pool} = require("../connect");
const {getTimeForYMD} = require("../utils/date-util");
const userSQL = require("../db/studentSql");
const {systemSql} = require("../db/system");
const code = -1

/**
 * 登录
 * 用户名密码不可为空，在用户表查到该用户后，查询配置表na_crypto，对密码进行加密，并对比用户表中的密码
 * 如果密码一致，则登录成功，并将此刻作为登陆时间，否则提示登录失败
 */
router.post('/login', (req, res) => {
  let _data;
  const name = req.body.name
  const pwd = req.body.password

  if (name && pwd && name !== '' && pwd !== '') {
    pool.getConnection((err, conn) => {
      conn.query("select * from na_admin where name = '" + name + "'", (e1, result1) => {
        const myPwd = result1[0].password
        if (myPwd) {
          aesEncrypt(pwd, function (response) {
            if (response.code === 200) {
              const newPwd = response.data
              if (myPwd === newPwd) {
                const loginTime = getTimeForYMD()
                conn.query("update na_admin set last_login = '" + loginTime + "'", (e3, result3) => {
                  if (!result3) {
                    console.log('登录时修改时间失败', e3.sqlMessage)
                  }
                })
                _data = {code: 200, msg: '登录成功'}
                resJson(res, _data)
              } else {
                _data = callBackError('-1', '登录失败，请检查用户名或密码')
                resJson(res, _data)
              }
            } else {
              _data = callBackError(-2, '添加失败，请联系管理员')
              resJson(res, _data)
            }
          })
        } else {
          _data = callBackError('-1', '登录失败，请检查用户名或密码')
          resJson(res, _data)
        }
      })
      pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
  } else {
    _data = callBackError('-1', '用户名和密码不可为空')
    resJson(res, _data)
  }
})

/**
 * 注册用户功能
 */
// router.post('/register', (req, res) => {
//   // 获取前台页面传过来的参数
//   let user = {
//     username: req.body.username,
//     realname: req.body.realname,
//     password: req.body.password
//   }
//   let _res = res;
//   // 判断参数是否为空
//   if (!user.username) {
//     return resJson(_res, callBackError(code, '用户名不能为空'))
//   }
//   if (!user.realname) {
//     return resJson(_res, callBackError(code, '真实姓名不能为空'))
//   }
//   if (!user.password) {
//     return resJson(_res, callBackError(code, '密码不能为空'))
//   }
//   let _data;
//   // 整合参数
//   // 从连接池获取连接
//   pool.getConnection((err, conn) => {
//     // 查询数据库该用户是否已存在
//     conn.query(userSQL.queryByName, user.username, (e, r) => {
//       if (e) _data = callBackError(code, e.sqlMessage)
//       if (r) {
//         //判断用户列表是否为空
//         if (r.length) {
//           //如不为空，则说明存在此用户
//           _data = callBackError(code, '用户已存在')
//         } else {
//           //插入用户信息
//           user.create_time = new Date().getTime()
//           conn.query(userSQL.insert, user, (err, result) => {
//             if (result) {
//               _data = callBackSuc('注册成功')
//             } else {
//               _data = callBackError(code, '注册失败')
//             }
//           })
//         }
//       }
//       setTimeout(() => {
//         //把操作结果返回给前台页面
//         resJson(_res, _data)
//       }, 200);
//     })
//     pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
//   })
// })

/**
 * 获取前端界面菜单栏
 */
router.get('/getMenu', (req, res) => {
  let _data;
  // 从连接池获取连接
  pool.getConnection((err, conn) => {
    conn.query(systemSql.chart.getMenu, (e, result) => {
      if (e) _data = callBackError(-1, e.sqlMessage)
      if (result) {
        if (result.length) {
          result.forEach(item => {
            let obj1 = {}
            let obj2 = {}
            let obj3 = {}
            if (item.type === 0) {
              obj1 = {
                path: item.path,
                name: item.name,
                meta: {
                  title: item.title,
                  icon: 'iconfont ' + item.icon
                },
                component: item.component,
                hidden: item.hidden,
                children: []
              }
            }
          })
          _data = callBackSuc('OK', result)
        } else {
          _data = callBackError(-1, '菜单栏不存在，请联系管理员添加')
        }
      }
      resJson(res, _data)
    })
    pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
  })
})

module.exports = router;
