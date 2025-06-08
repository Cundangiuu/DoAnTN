package vn.codezx.arise.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.entities.setting.Skill;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Integer> {

  @Modifying
  @Query("UPDATE Skill s SET s.isDelete = true WHERE s.grade.student.id = :studentId")
  void deleteSkillMAppingByStudent(@Param("studentId") int studentId);

  @Modifying
  @Query("UPDATE Skill s SET s.isDelete = true WHERE s.grade.student.id IN (:studentId) AND s.grade.classArise.id = :classId")
  void softDeleteSkillMappingByListStudent(@Param("studentId") List<Integer> studentId,
      @Param("classId") int classId);


}
