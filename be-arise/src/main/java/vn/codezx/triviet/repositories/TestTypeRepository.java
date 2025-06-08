package vn.codezx.triviet.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.constants.TypeOfTest;
import vn.codezx.triviet.entities.course.TestType;

@Repository
public interface TestTypeRepository extends JpaRepository<TestType, Integer> {
  Optional<TestType> findByType(TypeOfTest type);
}
