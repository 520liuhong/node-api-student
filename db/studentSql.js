const userSQL = {
    queryAll: 'select * from student',   // 查询所有用户
    queryByName: 'select * from  student where username=?',  // 通过用户名索引查询用户
    queryByNamePassword: 'select * from student where username=? and password=?',  // 通过用户名和密码索引查询用户
    insert: 'insert into student set ?',  // 插入新用户
    updateUser: 'update student set ? where username=?',// 更新用户信息
    deleteUser: 'delete from student where username=?' // 删除用户
}

module.exports = userSQL
