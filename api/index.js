const {router} = require("../connect");

const student = require("./NewStuApi")
const admin = require("./adminApi")
const classApi = require("./classApi") // class属于关键字，所以不能直接使用

module.exports = student
module.exports = admin
module.exports = classApi
module.exports = router;
