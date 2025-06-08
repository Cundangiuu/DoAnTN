package vn.codezx.triviet.repositories;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.staff.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Integer> {

  Staff findByCode(String code);


  Optional<Staff> findByIdAndIsDeleteFalse(Integer staffId);


  Page<Staff> findAllByIsDeleteIsFalse(Pageable pageable);


  Staff findByEmailAddressAndIsDeleteIsFalse(String email);

  @Query(nativeQuery = true, value = """
        select
          s1_0.id,
          s1_0.avatar_url,
          s1_0.code,
          s1_0.created_at,
          s1_0.created_by,
          s1_0.email_address,
          s1_0.first_name,
          s1_0.is_delete,
          s1_0.last_name,
          s1_0.phone_number,
          s1_0.rates,
          s1_0.refresh_token,
          s1_0.updated_at,
          s1_0.updated_by,
          s1_0.weekly_hours
      from
          staff s1_0
          inner join staff_role sr
          on sr.staff_id = s1_0.id
          inner join staff_class_schedule scs
          on s1_0.id = scs.staff_id
      where
          (
              lower(s1_0.first_name) like lower(concat('%', :query,'%'))
              or lower(s1_0.last_name) like lower(concat('%', :query,'%'))
              or lower(s1_0.email_address) like lower(concat('%', :query,'%'))
              or lower(s1_0.phone_number) like lower(concat('%', :query,'%'))
          )
          and sr.role_id in :roleIds
          and (scs.class_schedule_id in :scheduleIds)
      order by
          s1_0.created_at desc
        """)
  Page<Staff> searchStaffsByRoleAndSchedule(@Param("query") String query,
      @Param("roleIds") List<Integer> roleIds, @Param("scheduleIds") List<Integer> scheduleIds,
      Pageable pageable);

  @Query(nativeQuery = true, value = """
        select
          s1_0.id,
          s1_0.avatar_url,
          s1_0.code,
          s1_0.created_at,
          s1_0.created_by,
          s1_0.email_address,
          s1_0.first_name,
          s1_0.is_delete,
          s1_0.last_name,
          s1_0.phone_number,
          s1_0.rates,
          s1_0.refresh_token,
          s1_0.updated_at,
          s1_0.updated_by,
          s1_0.weekly_hours
      from
          staff s1_0
          inner join staff_role sr
          on sr.staff_id = s1_0.id
      where
          (
              lower(s1_0.first_name) like lower(concat('%', :query,'%'))
              or lower(s1_0.last_name) like lower(concat('%', :query,'%'))
              or lower(s1_0.email_address) like lower(concat('%', :query,'%'))
              or lower(s1_0.phone_number) like lower(concat('%', :query,'%'))
          )
          and sr.role_id in :roleIds
      order by
          s1_0.created_at desc
        """)
  Page<Staff> searchStaffsByRole(@Param("query") String query,
      @Param("roleIds") List<Integer> roleIds, Pageable pageable);

}
