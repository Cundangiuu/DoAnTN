package vn.codezx.arise.repositories;

import java.time.DayOfWeek;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.entities.setting.Schedule;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {

    Optional<Schedule> findByIdAndIsDeleteIsFalse(Integer scheduleId);

    Page<Schedule> findAllByIsDeleteIsFalse(Pageable pageable);

    List<Schedule> findAllByIsDeleteIsFalse();

    List<Schedule> findAllByIdInAndIsDeleteIsFalse(List<Integer> ids);

    @Query(value = "select s from Schedule s where s.dayOfWeek = :dayOfWeek and s.startTime = :startTime and s.endTime = :endTime")
    Optional<Schedule> findScheduleFromInfo(@Param("dayOfWeek") DayOfWeek dayOfWeek,
            @Param("startTime") Date startTime, @Param("endTime") Date endTime);
}
