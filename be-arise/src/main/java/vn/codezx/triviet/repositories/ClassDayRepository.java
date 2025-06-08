package vn.codezx.triviet.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import vn.codezx.triviet.constants.TypeOfTest;
import vn.codezx.triviet.entities.course.ClassDay;


@Repository
public interface ClassDayRepository extends JpaRepository<ClassDay, Integer> {

  Optional<ClassDay> findByIdAndIsDeleteIsFalse(int id);

  @Query(value = "select c from ClassDay c where c.classDate between :from and :to and c.isDelete = false and c.lesson.lessonType.type in :types")
  List<ClassDay> findTestDaysInRange(@Param("from") Date from, @Param("to") Date to,
      @Param("types") List<TypeOfTest> types);

  @Modifying
  @Query("DELETE FROM ClassDay c WHERE c.lesson.id = :lessonId")
  void deleteByLessonId(@Param("lessonId") int lessonId);
}
