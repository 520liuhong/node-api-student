/**
 * 管理员接口sql页
 */

exports.adminSQL = {
    //
    getAdminInfo: 'select * from na_admin',
    getAdminInfoTotal: 'select count(Id) as total from na_admin'
}
