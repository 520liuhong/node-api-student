/**
 * @name: 班级管理接口
 * @description: 班级管理接口
 * @author: newhome
 * @date: 2023-03-23 11:44:46
 */

exports.classSQL = {
    // 获取年级接口
    getClass: 'select na_class.Id as id,na_class.class_id as classId,na_class.class_name as className,na_class.college_id as collegeId,na_college.college_name as collegeName,na_specialty.specialty_id as specialtyId,na_specialty.specialty_name as specialtyName,na_teacher.teacher_name as teacher from na_class, na_college, na_specialty, na_teacher where na_class.college_id=na_college.college_id and na_class.specialty_id = na_specialty.specialty_id and na_class.head_teacher = na_teacher.teacher_id',
    getClass1: 'select * from na_class',
    getClassTotal: 'select count(Id) from na_class'
}
