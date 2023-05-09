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

/**
 * 校验字符串是否为yyyy-mm-dd hh:mm:ss格式
 * @param str
 * @returns {boolean}
 */
exports.checkDateIsYMD = function (str) {
    const reg = /^((\d{2}(([02468][048])|([13579][26]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|([1-2][0-9])))))|(\d{2}(([02468][1235679])|([13579][01345789]))[\-\/\s]?((((0?[13578])|(1[02]))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))[\-\/\s]?((0?[1-9])|([1-2][0-9])|(30)))|(0?2[\-\/\s]?((0?[1-9])|(1[0-9])|(2[0-8]))))))(\s((([0-1][0-9])|(2?[0-3]))\:([0-5]?[0-9])((\s)|(\:([0-5]?[0-9])))))?$/;
    let flag = false
    if (str) {
        flag = reg.test(str)
    }
    return flag
}
