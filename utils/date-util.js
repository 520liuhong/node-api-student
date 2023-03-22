/**
 * @description: 时间处理组件
 * @author: newhome
 * @date: 2023-03-22 17:27:20
 */

/**
 * 将时间戳转为YYYY-MM-DD hh:mm:ss格式
 * @param e
 * @returns {string}
 */
exports.getTimeForYMD = function (e) {
    let initDate = e || new Date()
    initDate = new Date(initDate).getTime()

    // 将时间戳格式转换成年月日时分秒
    let date = new Date(initDate)
    let Y = date.getFullYear() + '-'
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    let D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '

    let h = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours()) + ':'
    let m = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes()) + ':'
    let s = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds())

    return Y + M + D + h + m + s
}
