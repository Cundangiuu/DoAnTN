package vn.codezx.triviet.repositories;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.setting.Formula;

@Repository
public interface FormulaRepository extends JpaRepository<Formula, Integer> {

  Page<Formula> findByIsDeleteFalse(Pageable pageable);

  Optional<Formula> findByIdAndIsDeleteFalse(int formulaId);

  Page<Formula> findAllByIsDeleteFalse(Pageable pageable);
}
