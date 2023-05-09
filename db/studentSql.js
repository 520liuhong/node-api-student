/**
 * @name: 学生接口sql
 * @description: 学生相关接口的sql语句
 * @author: newhome
 * @date: 2023-02-13 18:42:52
 */

exports.stuSQL = {
    // 查询所有学生
    getStuInfo: 'select na_student.Id as id, na_grade.grade_id as gradeId, na_grade.grade_name as grade, na_student.college_id as collegeId,college_name as college,na_student.specialty_id as specialtyId,specialty_name as specialty,na_student.class_id as classId,class_name as class,stu_id as stuId,stu_name as name,stu_sex as sex,stu_birthday as birthday,stu_age as age,stu_address as address,stu_phone as phoneNo from na_student,na_grade,na_college,na_specialty,na_class where na_student.college_id = na_college.college_id and na_student.grade_id = na_grade.grade_id and na_student.specialty_id = na_specialty.specialty_id and na_student.class_id = na_class.class_id order by na_student.Id desc',
    // 获取学生总数量
    getStuTotal: 'select count(Id) as total from na_student',
    // 查询所有院系
    getAllCollege: 'select college_id as id, college_name as name from na_college',
    // 查询所有专业
    getAllSpecialty: 'select specialty_id as id, specialty_name as name from na_specialty',
    // 查询所有班级
    getAllClass: 'select na_class.college_id,college_name,na_class.specialty_id,specialty_name,class_id,class_name from na_college,na_specialty,na_class where na_class.college_id = na_college.college_id and na_class.specialty_id = na_specialty.specialty_id',
    // 根据院系查专业
    getSpecialtyByCollege: 'select specialty_id as id, specialty_name as name from na_specialty where college_id = ?',
    // 根据专业查班级
    getClassBySpecialty: 'select class_id as id,class_name as name from na_class where specialty_id = ?',
    // 根据院系查询专业
    // getSpecialtyByCollege: 'select specialty_id, specialty_name from na_college, na_specialty where na_college.college_id = na_specialty.college_id',
    // 用户名称模糊查询
    getStuByNameOrId: 'select na_student.Id as id, na_student.college_id as collegeId,college_name as college,na_student.specialty_id as specialtyId,specialty_name as specialty,na_student.class_id as classId,class_name as class,stu_id as stuId,stu_name as name,stu_sex as sex,stu_birthday as birthday,stu_age as age,stu_address as address,stu_phone as phoneNo from na_student,na_college,na_specialty,na_class where na_student.college_id = na_college.college_id and na_student.specialty_id = na_specialty.specialty_id and na_student.class_id = na_class.class_id and concat(stu_name,stu_id) like ? order by na_student.Id desc',
    getStuByNameOrIdTotal: 'select count(Id) as total from na_student where concat(stu_name,stu_id) like ?',
    // 添加用户
    addStu: 'insert into na_student (grade_id,college_id,specialty_id,class_id,stu_id,stu_name,stu_sex,stu_birthday,stu_age,stu_address,stu_phone,create_time) values (?,?,?,?,?,?,?,?,?,?,?,?)',
    // 删除学生
    delStu: 'delete from na_student where Id in (?)',
    // 更新学生信息
    updateStu: 'update na_student set grade_id=?, college_id=?,specialty_id=?,class_id=?,stu_id=?,stu_name=?,stu_sex=?,stu_birthday=?,stu_age=?,stu_address=?,stu_phone=?,update_time=?,update_user=? where Id=?',
    // 获取最近的4个年级
    getGrade: 'select grade_id as id, grade_name as name from na_grade order by grade_id desc limit 0,4'
}
