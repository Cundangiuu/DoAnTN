package vn.codezx.triviet.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.student.Criteria;

@Repository
public interface CriteriaRepository extends JpaRepository<Criteria, Integer> {
  @Modifying
  @Query("UPDATE Criteria c SET c.isDelete = true WHERE c.grade.student.id IN (:studentId) AND c.grade.classTvms.id = :classId")
  void softDeleteCriteriaMappingByListStudent(@Param("studentId") List<Integer> studentId, @Param("classId") int classId);
}
