const {pool, router, Res} = require('../connect')

router.post('/', (req, res) => {
    pool.getConnection((err, conn) => {
        conn.query("select * from axios_demo", (e, r) => {
            if (e) throw error
            res.json(new Res({data: r}))
        })
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})

module.exports = router;
