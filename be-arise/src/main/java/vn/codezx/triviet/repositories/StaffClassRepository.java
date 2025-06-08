package vn.codezx.triviet.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.staff.StaffClass;
import vn.codezx.triviet.entities.staff.id.StaffClassId;

@Repository
public interface StaffClassRepository extends JpaRepository<StaffClass, StaffClassId> {

}
