exports.userSQL = {
    getAll: 'select * from na_test',   // 查询所有用户
    getByName: 'select * from  na_test where username=?',  // 通过用户名索引查询用户
    getByNamePassword: 'select * from na_test where username=? and password=?',  // 通过用户名和密码索引查询用户
    insert: 'insert into na_test set ?',  // 插入新用户
    updateUser: 'update na_test set ? where username=?',// 更新用户信息
    deleteUser: 'delete from na_test where username=?' // 删除用户
}

exports.stuSQL = {
    // 查询所有用户
    getStuInfo: 'select college_name as college,specialty_name as specialty,class_name as class,stu_id as id,stu_name as name,stu_sex as sex,stu_age as age,stu_city as city,stu_phone as phone from na_student,na_college,na_specialty,na_class where na_student.college_id = na_college.college_id and na_student.specialty_id = na_specialty.specialty_id and na_student.class_id = na_class.class_id',
    // 查询所有院系
    getAllCollege: 'select college_id as id, college_name as name from na_college',
    // 查询所有专业
    getAllSpecialty: 'select specialty_id as id, specialty_name as name from na_specialty',
    // 查询所有班级
    getAllClass: 'select na_class.college_id,college_name,na_class.specialty_id,specialty_name,class_id,class_name from na_college,na_specialty,na_class where na_class.college_id = na_college.college_id and na_class.specialty_id = na_specialty.specialty_id',
    // 根据院系查专业
    getSpecialtyByCollege: 'select specialty_id, specialty_name from na_specialty where college_id = ?',
    // 根据专业查班级
    getClassBySpecialty: 'select class_id,class_name from na_class where specialty_id = ?',
    // 根据院系查询专业
    // getSpecialtyByCollege: 'select specialty_id, specialty_name from na_college, na_specialty where na_college.college_id = na_specialty.college_id',
    // 用户名称模糊查询
    getStuByName: 'select * from na_specialty where specialty_name like ?',
    // 添加用户
    addStu: 'insert into na_student (college_id,specialty_id,class_id,stu_id,stu_name,stu_sex) values (?,?,?,?,?,?)',
    // 删除学生
    delStu: 'delete from na_student where stu_id=?',
}

// module.exports = userSQL
