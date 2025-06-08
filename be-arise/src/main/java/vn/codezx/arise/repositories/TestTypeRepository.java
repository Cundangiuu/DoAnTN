package vn.codezx.arise.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.constants.TypeOfTest;
import vn.codezx.arise.entities.course.TestType;

@Repository
public interface TestTypeRepository extends JpaRepository<TestType, Integer> {
  Optional<TestType> findByType(TypeOfTest type);
}
