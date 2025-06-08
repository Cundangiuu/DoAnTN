package vn.codezx.triviet.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.reporting.Enrollment;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Integer> {

    @Query("SELECT l " + "FROM Enrollment l " + "JOIN l.course c "
            + "WHERE c.code = :courseCode AND c.isDelete = false AND l.isDelete = false")
    List<Enrollment> findEnrollmentsByCourseCodeAndIsDeleteFalse(
            @Param("courseCode") String courseCode);

    @Query("SELECT l " + "FROM Enrollment l " + "JOIN l.course c "
            + "WHERE c.code = :courseCode AND c.isDelete = false AND l.isDelete = false AND l.classTvms.code = :classCode")
    List<Enrollment> findEnrollmentsByCourseCodeAndClassCode(@Param("courseCode") String courseCode,
            @Param("classCode") String classCode);

    Enrollment findByIdAndIsDeleteFalse(int enrollmentId);

    @Query("SELECT e FROM Enrollment e WHERE e.student.code in :studentIds AND e.isDelete = false ORDER BY e.createdAt DESC")
    List<Enrollment> findEnrollmentByCourseId(@Param("courseId") int courseId,
            @Param("studentIds") List<Integer> studentIds);

    @Query("SELECT e FROM Enrollment e WHERE e.student.code = :studentCode AND e.isDelete = false ORDER BY e.createdAt DESC")
    List<Enrollment> findEnrollmentByStudentCode(@Param("studentCode") String studentCode);

    @Query(nativeQuery = true,
            value = "SELECT * FROM enrollment WHERE student_id IN (:studentIds) AND course_id = :courseId AND is_delete = false")
    List<Enrollment> findStudentInClass(@Param("courseId") int courseId,
            @Param("studentIds") List<Integer> studentIds);

    @Modifying
    @Query("UPDATE Enrollment e SET e.isDelete = true WHERE e.student.id = :id")
    void deleteEnrollmentMappingByStudent(@Param("id") int id);

    @Modifying
    @Query("UPDATE Enrollment e SET e.isDelete = true WHERE e.student.id IN (:id) AND e.classTvms.id = :classId")
    void softDeleteEnrollmentMappingByListStudent(@Param("id") List<Integer> id,
            @Param("classId") int classId);

    @Modifying
    @Query("UPDATE Enrollment e SET e.isDelete = true WHERE e.classTvms.id = :id")
    void deleteEnrollmentMappingByClass(@Param("id") int id);
}
