package vn.codezx.arise.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.entities.student.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {

    Optional<Student> findTop1ByCreatedAtBetweenAndIsDeleteIsFalseOrderByCodeDesc(Date startOfDay,
                                                                                  Date endOfDay);

    Optional<Student> findByCodeAndIsDeleteIsFalse(String studentCode);

    @Query(value = "SELECT Count(DISTINCT s.id)\n"
            + "FROM student s\n"
            + "JOIN enrollment e ON s.id = e.student_id\n"
            + "JOIN class_tvms ct ON e.class_tvms_id = ct.id\n"
            + "JOIN class_day cd ON ct.id = cd.class_id\n"
            + "WHERE \n"
            + "  (\n"
            + "    cd.class_date >= CURRENT_DATE AND ct.start_date <= CURRENT_DATE\n"
            + "  )\n"
            + "  OR\n"
            + "  (\n"
            + "    ct.start_date > CURRENT_DATE\n"
            + "  );\n", nativeQuery = true)
    Integer getTotalNumberOfStudent();

    @Query("SELECT s FROM Student s WHERE s.isDelete = false AND (s.id NOT IN "
        + "(SELECT i.enrollment.student.id FROM Invoice i WHERE i.invoiceStatus IN ('NOT_PAID', 'PARTIALLY_PAID') and i.isDelete = false))"
        + "AND (LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
        + "LOWER(s.nickname) LIKE LOWER(CONCAT('%', :query, '%')) OR "
        + "LOWER(s.emailAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR "
        + "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR "
        + "LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Student> getStudentWithoutDebt(@Param("query") String query, Pageable pageable);


    @Query("SELECT DISTINCT s FROM Student s WHERE "
            + "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.nickname) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.emailAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND s.isDelete = false")
    Page<Student> searchByQuery(@Param("query") String query, Pageable pageable);

    @Query("SELECT DISTINCT s FROM Student s WHERE "
            + "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.nickname) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.emailAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND "
            + "(s.avatarUrl IS NULL) AND (s.isDelete = false)")
    Page<Student> searchByQueryAndAvatarIsNull(@Param("query") String query, Pageable pageable);

    @Query("SELECT DISTINCT s FROM Student s WHERE "
            + "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.nickname) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.emailAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND "
            + "(s.avatarUrl IS NOT NULL) AND (s.isDelete = false)")
    Page<Student> searchByQueryAndAvatarIsNotNull(@Param("query") String query, Pageable pageable);

    @Query("SELECT s FROM Student s JOIN Enrollment e ON s.id = e.student.id WHERE e.classArise.code = :classCode AND e.isDelete = false AND s.isDelete = false")
    List<Student> findByClassCode(@Param("classCode") String classCode);

    Page<Student> findByAvatarUrlIsNullAndIsDeleteIsFalse(Pageable pageable);

    Page<Student> findByAvatarUrlIsNotNullAndIsDeleteIsFalse(Pageable pageable);

    Page<Student> findAllByIsDeleteIsFalse(Pageable pageable);

    List<Student> findAllByIdInAndIsDeleteIsFalse(List<Integer> id);

    @Query(
            value = "SELECT s FROM Student s WHERE s.isDelete = false AND s.id NOT IN (SELECT e.student.id FROM Enrollment e WHERE e.classArise IS NULL AND e.isDelete = false) AND s.id NOT IN (SELECT i.enrollment.student.id FROM Invoice i WHERE i.invoiceStatus = 'NOT_PAID' AND i.isDelete = false)")
    List<Student> getPreEnrollmentStudent();

    Student findByCodeAndIsDeleteFalse(String studentCode);

    Optional<Student> findByIdAndIsDeleteFalse(int studentId);

    @Query(
            value = "SELECT s FROM Student s WHERE s.id IN :ids AND s.id NOT IN (SELECT st.id FROM ClassArise c JOIN c.students st WHERE c.id = :classId)")
    List<Student> findNotIncludedStudents(@Param("ids") List<Integer> ids,
                                          @Param("classId") int classId);

    Optional<Student> findTop1ByCreatedAtBetweenOrderByCodeDesc(Date startOfDay, Date endOfDay);

    @Modifying
    @Query(value = "DELETE FROM class_student WHERE student_id = :id", nativeQuery = true)
    void deleteStudentMappingClassById(@Param("id") int id);

    @Modifying
    @Query(value = "DELETE FROM class_student WHERE student_id IN (:id) AND class_id = :classId", nativeQuery = true)
    void deleteStudentMappingClassByListId(@Param("id") List<Integer> id,
                                           @Param("classId") Integer classId);

    List<Student> findAllByIsDeleteIsFalse();

    List<Student> findByAvatarUrlIsNullAndIsDeleteIsFalse();

    List<Student> findByAvatarUrlIsNotNullAndIsDeleteIsFalse();

    @Query("SELECT DISTINCT s FROM Student s WHERE "
            + "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.nickname) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.emailAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND s.isDelete = false")
    List<Student> searchByQuery(@Param("query") String query);

    @Query("SELECT DISTINCT s FROM Student s WHERE "
            + "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.nickname) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.emailAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND "
            + "(s.avatarUrl IS NULL) AND (s.isDelete = false)")
    List<Student> searchByQueryAndAvatarIsNull(@Param("query") String query);

    @Query("SELECT DISTINCT s FROM Student s WHERE "
            + "(LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.nickname) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.emailAddress) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.phoneNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR "
            + "LOWER(s.code) LIKE LOWER(CONCAT('%', :query, '%'))) AND "
            + "(s.avatarUrl IS NOT NULL) AND (s.isDelete = false)")
    List<Student> searchByQueryAndAvatarIsNotNull(@Param("query") String query);
}
