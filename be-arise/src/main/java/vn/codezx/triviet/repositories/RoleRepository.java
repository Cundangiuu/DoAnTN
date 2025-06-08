package vn.codezx.triviet.repositories;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.constants.RoleName;
import vn.codezx.triviet.entities.staff.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Integer> {

  Page<Role> findAllByIsDeleteIsFalse(Pageable pageable);

  List<Role> findAllByIsDeleteIsFalse();

  Role findByNameAndIsDeleteIsFalse(RoleName academicStaff);

}
