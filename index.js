const {app, pool} = require('./connect')
const student = require('./api/index')
app.all('*', (req, res, next) => {
    // 这里处理全局拦截，一定要写在最上面
    // 设置允许跨域的域名，*代表允许任意域名跨域
    res.header('Access-Control-Allow-Origin', '*')
    // 允许的header类型
    res.header('Access-Control-Allow-Headers', 'content-type')
    // 跨域允许的请求方式
    res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
    if (req.method.toLowerCase() === 'options') {
        res.sendStatus(200) // 让options尝试请求快速结束
    } else {
        next()
    }
})
app.all('/', (req, res) => {
    pool.getConnection((err, conn) => {
        res.json({type: 'test'})
        pool.releaseConnection(conn) // 释放连接池，等待别的连接使用
    })
})
app.use('/api', student)
app.listen(8088, () => {
    console.log('服务启动')
})
