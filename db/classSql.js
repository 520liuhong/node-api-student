/**
 * @name: 班级管理接口
 * @description: 班级管理接口
 * @author: newhome
 * @date: 2023-03-23 11:44:46
 */

exports.classSQL = {
    // 获取班级sql
    getClass: 'select na_class.Id as id,na_class.grade_id as gradeId,na_class.class_id as classId,na_class.class_name as class,na_grade.grade_name as grade,na_class.college_id as collegeId,na_college.college_name as college,na_specialty.specialty_id as specialtyId,na_specialty.specialty_name as specialty,na_teacher.teacher_id as teacherId,na_teacher.teacher_name as teacher from na_class, na_college, na_specialty,na_grade, na_teacher where na_class.college_id=na_college.college_id and na_class.grade_id=na_grade.grade_id and na_class.specialty_id = na_specialty.specialty_id and na_class.head_teacher = na_teacher.teacher_id order by na_class.class_id desc',
    // 获取所有班级数量
    getClassTotal: 'select count(Id) from na_class',
    // 删除班级
    delClass: 'delete from na_class where Id in (?)',
    // 获取教师列表
    getTeacher: 'select teacher_id as id,teacher_name as name from na_teacher order by teacher_id',
    // 根据学院获取教师列表
    getTeacherByCollege: 'select teacher_id as id,teacher_name as name from na_teacher where college_id=? order by teacher_id',
    // 根据院系获取教师列表
    getTeacherBySpecialty: 'select teacher_id as id,teacher_name as name from na_teacher where specialty_id=? order by teacher_id',
    // 获取教师总数量
    getTeacherTotal: 'select count(Id) from na_teacher',
    // 获取指定条件的教师数量
    getTeacherTotalByCollege: 'select count(Id) from na_teacher where college_id=?',
    // 创建班级
    addClass: 'insert into na_class (grade_id,college_id,specialty_id,class_id,class_name,head_teacher,create_time) values (?,?,?,?,?,?,?)',
    // 更新班级信息
    updateClass: 'update na_class set grade_id=?, college_id=?,specialty_id=?,class_id=?,class_name=?,head_teacher=?,update_time=?,update_user=? where Id=?',
}
