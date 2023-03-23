/**
 * @name: 班级管理接口
 * @description: 班级管理接口
 * @author: newhome
 * @date: 2023-03-23 11:44:46
 */

exports.classSQL = {
    // 获取年级接口
    getClass: 'select * from na_class',
    getClassTotal: 'select count(Id) from na_class'
}
