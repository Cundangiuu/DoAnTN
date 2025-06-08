package vn.codezx.arise.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.entities.staff.StaffRole;

@Repository
public interface StaffRoleRepository extends JpaRepository<StaffRole, Integer> {

}
