package vn.codezx.triviet.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.dtos.grade.StudentGradeDTO;
import vn.codezx.triviet.entities.course.ClassTvms;
import vn.codezx.triviet.entities.course.TestType;
import vn.codezx.triviet.entities.student.Grade;
import vn.codezx.triviet.entities.student.Student;

@Repository
public interface GradeRepository extends JpaRepository<Grade, Integer> {

  Page<Grade> findByStudentAndIsDeleteFalse(Student student, Pageable pageable);

  Page<Grade> findByClassTvmsAndIsDeleteFalse(ClassTvms classTvms, Pageable pageable);

  Optional<Grade> findByIdAndIsDeleteFalse(int gradeId);

  Page<Grade> findByClassTvmsAndTestTypeAndIsDeleteFalse(ClassTvms classTvms, TestType testType,
      Pageable pageable);

  Page<Grade> findByStudentAndClassTvmsAndTestTypeAndIsDeleteFalse(Student student,
      ClassTvms classTvms, TestType testType, Pageable pageable);

  Page<Grade> findByStudentAndTestTypeAndIsDeleteFalse(Student student, TestType testType,
      Pageable pageable);

  Page<Grade> findByStudentAndClassTvmsAndIsDeleteFalse(Student student, ClassTvms classTvms,
      Pageable pageable);

  @Query("""
          SELECT new vn.codezx.triviet.dtos.grade.StudentGradeDTO(
              g.classTvms.code,
              SUM(CASE WHEN g.testType.type = 'MIDTERM' THEN g.score ELSE NULL END),
              SUM(CASE WHEN g.testType.type = 'FINAL' THEN g.score ELSE NULL END),
              SUM(CASE WHEN g.testType.type = 'COURSE' THEN g.score ELSE NULL END)
          )
          FROM Grade g
          WHERE g.student.id = :studentId
          GROUP BY g.classTvms.code
      """)
  List<StudentGradeDTO> findGradesByStudentId(@Param("studentId") Integer studentId);

  @Modifying
  @Query("UPDATE Grade g SET g.isDelete = true WHERE g.student.id = :id")
  void deleteGradeMappingByStudent(@Param("id") int id);

  @Modifying
  @Query("UPDATE Grade g SET g.isDelete = true WHERE g.student.id IN (:id) AND g.classTvms.id = :classId")
  void softDeleteGradeMappingByListStudent(@Param("id") List<Integer> id,
      @Param("classId") int classId);

  @Modifying
  @Query("UPDATE Grade g SET g.isDelete = true WHERE g.classTvms.id = :id")
  void deleteGradeMappingByClass(@Param("id") int id);

  List<Grade> findByClassTvmsAndTestTypeAndIsDeleteFalse(ClassTvms classTvms,
      TestType testTypeEntity);
}
