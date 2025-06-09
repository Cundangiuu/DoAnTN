package vn.codezx.arise.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.dtos.absence.AbsentStudentProjection;
import vn.codezx.arise.entities.course.ClassDay;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.student.Absence;
import vn.codezx.arise.entities.student.Student;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence, Integer> {

  Optional<Absence> findByStudentAndClassAriseAndClassDayAndIsDeleteFalse(Student student,
      ClassArise classArise,
      ClassDay classDay);

  List<Absence> findByStudentAndIsDeleteFalseOrderByCreatedAtDesc(Student student);

  @Query("SELECT a FROM Absence a WHERE a.classArise.code = :classCode AND a.isDelete = false")
  Optional<List<Absence>> getListAbsenceByClassCode(@Param("classCode") String classCode);

  @Modifying
  @Query("UPDATE Absence a SET a.isDelete = true WHERE a.student.id = :id")
  void deleteAbsenceMappingByStudent(@Param("id") int id);

  @Modifying
  @Query("UPDATE Absence a SET a.isDelete = true WHERE a.student.id IN (:id) AND a.classArise.id = :classId")
  void softDeleteAbsenceMappingByListStudent(@Param("id") List<Integer> id,
      @Param("classId") int classId);


  @Modifying
  @Query("UPDATE Absence a SET a.isDelete = true WHERE a.classArise.id = :id")
  void deleteAbsenceMappingByClass(@Param("id") int id);

  @Query(value = """
            SELECT c.class_name AS enrolledClass, cd.class_date AS absentDate,
                   s.name AS studentName, l.description AS lessonDescription,
                   cd.comment AS comment,
                   cd.home_work AS home_work,
                   s.nickname AS nickName
            FROM class_day cd
            JOIN class_arise c ON cd.class_id = c.id
            JOIN lesson l ON cd.lesson_id = l.id
            JOIN class_student cs ON cs.class_id = c.id 
            JOIN student s ON s.id = cs.student_id
            LEFT JOIN absence a ON a.student_id = s.id AND a.class_day_id = cd.id
            WHERE cd.class_date BETWEEN :dateFrom AND :dateTo
            AND (a.id IS NULL OR (a.is_absent = true AND a.is_delete = false))
            ORDER BY cd.class_date ASC
            ;
      """, nativeQuery = true)
  List<AbsentStudentProjection> findAbsentStudentInRange(@Param("dateFrom") Date dateFrom,
      @Param("dateTo") Date dateTo);

}
