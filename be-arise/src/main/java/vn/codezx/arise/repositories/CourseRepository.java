package vn.codezx.arise.repositories;


import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.constants.CourseLevelConstants;
import vn.codezx.arise.entities.course.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

  Optional<Course> findTop1ByCreatedAtBetweenOrderByCodeDesc(Date startOfDay, Date endOfDay);

  @Query("SELECT c FROM Course c WHERE c.courseLevel IN :levels AND c.isDelete = false")
  Page<Course> findByCourseLevelAndIsDeleteFalse(@Param("levels") List<CourseLevelConstants> levels,
      Pageable pageable);

  @Query("SELECT c FROM Course c WHERE c.courseLevel IN :levels AND c.isDelete = false")
  List<Course> findByCourseLevelAndIsDeleteFalseWithoutPage(
      @Param("levels") List<CourseLevelConstants> levels);

  Course findByIdAndIsDeleteFalse(int courseId);

  Course findByCodeAndIsDeleteFalse(String code);

  Page<Course> findAllByIsDeleteFalse(Pageable pageable);

  List<Course> findAllByIsDeleteFalse();

  @Query("SELECT c FROM Course c "
      + "WHERE (LOWER(c.code) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchString, '%'))) " + "AND c.isDelete = false")
  Page<Course> searchCourse(@Param("searchString") String searchString, Pageable pageable);

  @Query("SELECT c FROM Course c "
      + "WHERE (LOWER(c.code) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchString, '%'))) " + "AND c.isDelete = false")
  List<Course> searchCourseWithoutPage(@Param("searchString") String searchString);

  @Query("SELECT c FROM Course c "
      + "WHERE (LOWER(c.code) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchString, '%'))) "
      + "AND c.courseLevel IN :level " + "AND c.isDelete = false")
  Page<Course> findByCourseLevelAndCode(@Param("level") List<CourseLevelConstants> level,
      @Param("searchString") String searchString, Pageable pageable);

  @Query("SELECT c FROM Course c "
      + "WHERE (LOWER(c.code) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchString, '%'))) "
      + "AND c.courseLevel IN :level " + "AND c.isDelete = false")
  List<Course> findByCourseLevelAndCodeWithoutPage(@Param("level") List<CourseLevelConstants> level,
      @Param("searchString") String searchString);
}
