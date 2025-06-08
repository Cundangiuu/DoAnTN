package vn.codezx.arise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.entities.staff.KeyPairEntity;
import vn.codezx.arise.entities.staff.id.KeyPairId;
@Repository

public interface KeyPairRepository extends JpaRepository<KeyPairEntity, KeyPairId> {

}
