/**
 * 管理员接口sql页
 */

exports.adminSQL = {
    // 获取管理员列表
    getAdminInfo: 'select Id as id,name as name,role_id as role,status as status,create_time as createTime,update_time as updateTime,last_login as lastLoginTime,last_ip as lastLoginIp,remark as remark from na_admin',
    getAdminInfoTotal: 'select count(Id) as total from na_admin',
    getRoleList: 'select Id as id,name as name from na_role',
    getRoleTotal: 'select count(Id) as total from na_role',
    addAdmin: 'insert into na_admin (name, password, role_id, status, remark, create_time, update_user) values (?,?,?,?,?,?,?)',
    delAdmin: 'delete from na_admin where Id in (?)'
}
