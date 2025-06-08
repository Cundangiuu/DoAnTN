package vn.codezx.triviet.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.course.Lesson;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Integer> {

  Lesson findByIdAndIsDeleteFalse(int lessonId);

  @Modifying
  @Query("UPDATE Lesson l SET l.isDelete = :isDelete WHERE l IN :lessons")
  void updateIsDeleteByLessons(@Param("lessons") List<Lesson> lessons,
      @Param("isDelete") boolean isDelete);

  @Query("SELECT l " +
      "FROM Lesson l " +
      "JOIN l.course c " +
      "WHERE c.code = :courseCode AND c.isDelete = false AND l.isDelete = false order by l.id")
  List<Lesson> findLessonsByCourseCodeAndIsDeleteFalse(@Param("courseCode") String courseCode);

  @Modifying
  @Query("DELETE FROM Lesson l WHERE l.id = :lessonId")
  void deleteById(@Param("lessonId") int lessonId);

}
