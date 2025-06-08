package vn.codezx.triviet.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.staff.KeyPairEntity;
import vn.codezx.triviet.entities.staff.id.KeyPairId;
@Repository

public interface KeyPairRepository extends JpaRepository<KeyPairEntity, KeyPairId> {

}
