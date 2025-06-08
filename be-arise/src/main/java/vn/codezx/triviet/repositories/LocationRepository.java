package vn.codezx.triviet.repositories;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.setting.Location;

@Repository
public interface LocationRepository extends JpaRepository<Location, Integer> {

    Page<Location> findAllByIsDeleteIsFalse(Pageable pageable);

    Optional<Location> findByIdAndIsDeleteIsFalse(Integer locationId);
}
