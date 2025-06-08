package vn.codezx.arise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.entities.staff.StaffClass;
import vn.codezx.arise.entities.staff.id.StaffClassId;

@Repository
public interface StaffClassRepository extends JpaRepository<StaffClass, StaffClassId> {

}
