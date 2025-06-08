package vn.codezx.arise.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.arise.entities.course.ClassArise;
import vn.codezx.arise.entities.course.Course;


@Repository
public interface ClassAriseRepository extends JpaRepository<ClassArise, Integer> {

  @Query(value = "SELECT (\n"
      + "    SELECT COUNT(*) FROM (\n"
      + "        SELECT DISTINCT ct.id\n"
      + "        FROM class_tvms ct\n"
      + "        INNER JOIN class_day cd ON ct.id = cd.class_id\n"
      + "        WHERE cd.class_date >= CURRENT_DATE\n"
      + "          AND ct.start_date <= CURRENT_DATE\n"
      + "    ) AS ongoing\n"
      + ") + (\n"
      + "    SELECT COUNT(*) FROM (\n"
      + "        SELECT DISTINCT ct.id\n"
      + "        FROM class_tvms ct\n"
      + "        INNER JOIN class_day cd ON ct.id = cd.class_id\n"
      + "        WHERE ct.start_date > CURRENT_DATE\n"
      + "    ) AS upcoming\n"
      + ") AS total;\n",
      nativeQuery = true)
  Integer getTotalNumberOfClass();

  Optional<ClassArise> findTop1ByCreatedAtBetweenAndIsDeleteIsFalseOrderByCodeDesc(
      Date startOfDay, Date endOfDay);

  Optional<ClassArise> findTop1ByCreatedAtBetweenOrderByCodeDesc(Date startOfDay,
      Date endOfDay);

  boolean existsByCourseId(int courseId);

  Optional<ClassArise> findByIdAndIsDeleteFalse(int id);

  Optional<ClassArise> findByCodeAndIsDeleteFalse(String code);

  @Query("SELECT c FROM ClassArise c WHERE c.code IN :codes AND c.isDelete = false")
  List<ClassArise> findAllByCodeInAndIsDeleteFalse(@Param("codes") List<String> codes);

  Optional<ClassArise> findByNameAndIsDeleteFalse(String name);

  // SEARCH
  @Query("""
          SELECT DISTINCT ct
          FROM ClassArise ct
          WHERE ct.isDelete = false
            AND (
              LOWER(ct.code) LIKE LOWER(CONCAT('%', :searchString, '%')) OR
              LOWER(ct.name) LIKE LOWER(CONCAT('%', :searchString, '%'))
            )
          ORDER BY ct.startDate DESC, ct.id DESC
      """)
  Page<ClassArise> searchClass(@Param("searchString") String searchString, Pageable pageable);


  @Query(
      value = """
          SELECT * FROM (
              SELECT DISTINCT ON (c.id, c.start_date) c.*
              FROM class_tvms c
              INNER JOIN class_day cd ON c.id = cd.class_id
              WHERE c.is_delete = false
                AND (c.code ILIKE CONCAT('%', :searchString, '%')
                     OR c.class_name ILIKE CONCAT('%', :searchString, '%'))
                AND (c.staff_id = :staffId OR cd.teacher_id = :staffId)
              ORDER BY c.id, c.start_date
          ) sub
          ORDER BY sub.start_date DESC, sub.id DESC
            """,
      countQuery = """
          SELECT COUNT(*) FROM (
              SELECT DISTINCT c.id, c.start_date
              FROM class_tvms c
              INNER JOIN class_day cd ON c.id = cd.class_id
              WHERE c.is_delete = false
                AND (c.code ILIKE CONCAT('%', :searchString, '%')
                     OR c.class_name ILIKE CONCAT('%', :searchString, '%'))
                AND (c.staff_id = :staffId OR cd.teacher_id = :staffId)
          ) sub
              """,
      nativeQuery = true
  )
  Page<ClassArise> searchClassByStaff(
      @Param("searchString") String searchString,
      @Param("staffId") int staffId,
      Pageable pageable
  );

  // SEARCH ON GOING CLASS

  @Query(
      value = """
          SELECT * FROM (
              SELECT DISTINCT ON (ct.id, ct.start_date)
                     ct.*
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE cd.class_date >= CURRENT_DATE
                AND ct.start_date <= CURRENT_DATE
                AND (ct.code ILIKE CONCAT('%', :searchString, '%')
                     OR ct.class_name ILIKE CONCAT('%', :searchString, '%'))
                AND ct.is_delete = false
              ORDER BY ct.id, ct.start_date
          ) sub
          ORDER BY sub.start_date DESC, sub.id DESC
          """,
      countQuery = """
          SELECT COUNT(*) FROM (
            SELECT DISTINCT ct.id
            FROM class_tvms ct
            INNER JOIN class_day cd ON ct.id = cd.class_id
            WHERE cd.class_date >= CURRENT_DATE
              AND ct.start_date <= CURRENT_DATE
              AND (ct.code ILIKE CONCAT('%', :searchString, '%')
                   OR ct.class_name ILIKE CONCAT('%', :searchString, '%'))
              AND ct.is_delete = false
          ) sub
          """,
      nativeQuery = true
  )
  Page<ClassArise> searchOnGoingClass(
      @Param("searchString") String searchString,
      Pageable pageable
  );


  @Query(
      value = """
          SELECT * FROM (
              SELECT DISTINCT ON (ct.id, ct.start_date)
                     ct.*
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE cd.class_date >= CURRENT_DATE
                AND ct.start_date <= CURRENT_DATE
                AND (ct.code ILIKE CONCAT('%', :searchString, '%')
                     OR ct.class_name ILIKE CONCAT('%', :searchString, '%'))
                AND (ct.staff_id = :staffId OR cd.teacher_id = :staffId)
                AND ct.is_delete = false
              ORDER BY ct.id, ct.start_date
          ) sub
          ORDER BY sub.start_date DESC, sub.id DESC
          """,
      countQuery = """
          SELECT COUNT(*) FROM (
              SELECT DISTINCT ct.id
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE cd.class_date >= CURRENT_DATE
                AND ct.start_date <= CURRENT_DATE
                AND (ct.code ILIKE CONCAT('%', :searchString, '%')
                     OR ct.class_name ILIKE CONCAT('%', :searchString, '%'))
                AND (ct.staff_id = :staffId OR cd.teacher_id = :staffId)
                AND ct.is_delete = false
          ) count_sub;
          """,
      nativeQuery = true
  )
  Page<ClassArise> searchOnGoingClassByStaff(
      @Param("searchString") String searchString,
      @Param("staffId") int staffId,
      Pageable pageable
  );


  // SEARCH NEW CLASS
  @Query(
      value = """
          SELECT * FROM (
              SELECT DISTINCT ON (ct.id, ct.start_date)
                     ct.*
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE ct.start_date > CURRENT_DATE
                AND ct.is_delete = false
                AND (
                  ct.code ILIKE CONCAT('%', :searchString, '%')
                  OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
                )
              ORDER BY ct.id, ct.start_date
          ) sub
          ORDER BY sub.start_date DESC, sub.id DESC
          """,
      countQuery = """
          SELECT COUNT(*) FROM (
              SELECT DISTINCT ct.id
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE ct.start_date > CURRENT_DATE
                AND ct.is_delete = false
                AND (
                  ct.code ILIKE CONCAT('%', :searchString, '%')
                  OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
                )
          ) count_sub
          """,
      nativeQuery = true
  )
  Page<ClassArise> searchNewClass(
      @Param("searchString") String searchString,
      Pageable pageable
  );


  @Query(
      value = """
          SELECT * FROM (
              SELECT DISTINCT ON (ct.id, ct.start_date)
                     ct.*
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE ct.start_date > CURRENT_DATE
                AND ct.is_delete = false
                AND (
                  ct.code ILIKE CONCAT('%', :searchString, '%')
                  OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
                )
                AND (
                  ct.staff_id = :staffId
                  OR cd.teacher_id = :staffId
                )
              ORDER BY ct.id, ct.start_date
          ) sub
          ORDER BY sub.start_date DESC, sub.id DESC
          """,
      countQuery = """
          SELECT COUNT(*) FROM (
              SELECT DISTINCT ct.id
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE ct.start_date > CURRENT_DATE
                AND ct.is_delete = false
                AND (
                  ct.code ILIKE CONCAT('%', :searchString, '%')
                  OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
                )
                AND (
                  ct.staff_id = :staffId
                  OR cd.teacher_id = :staffId
                )
          ) count_sub
          """,
      nativeQuery = true
  )
  Page<ClassArise> searchNewClassByStaff(
      @Param("searchString") String searchString,
      @Param("staffId") int staffId,
      Pageable pageable
  );


  // SEARCH ENDED CLASS
  @Query(
      value = """
          SELECT *
          FROM class_tvms ct
          WHERE ct.id NOT IN (
              SELECT cd.class_id
              FROM class_day cd
              INNER JOIN class_tvms cct ON cct.id = cd.class_id
              WHERE cd.class_date >= CURRENT_DATE
                OR cct.start_date > CURRENT_DATE
          )
          AND ct.is_delete = false
          AND (
              ct.code ILIKE CONCAT('%', :searchString, '%')
              OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
          )
          ORDER BY ct.start_date DESC, ct.id DESC
          """,
      countQuery = """
          SELECT COUNT(*) FROM (
              SELECT ct.id
              FROM class_tvms ct
              WHERE ct.id NOT IN (
                  SELECT cd.class_id
                  FROM class_day cd
                  INNER JOIN class_tvms cct ON cct.id = cd.class_id
                  WHERE cd.class_date >= CURRENT_DATE
                    OR cct.start_date > CURRENT_DATE
              )
              AND ct.is_delete = false
              AND (
                  ct.code ILIKE CONCAT('%', :searchString, '%')
                  OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
              )
          ) count_sub
          """,
      nativeQuery = true
  )
  Page<ClassArise> searchEndedClass(
      @Param("searchString") String searchString,
      Pageable pageable
  );


  @Query(
      value = """
          SELECT * FROM (
              SELECT DISTINCT ON (ct.id, ct.start_date)
                     ct.*
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE ct.id NOT IN (
                  SELECT cd.class_id
                  FROM class_day cd
                  JOIN class_tvms ct2 ON cd.class_id = ct2.id
                  WHERE cd.class_date >= CURRENT_DATE
                     OR ct2.start_date > CURRENT_DATE
              )
              AND ct.is_delete = false
              AND (
                  ct.code ILIKE CONCAT('%', :searchString, '%')
                  OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
              )
              AND (
                  ct.staff_id = :staffId OR cd.teacher_id = :staffId
              )
              ORDER BY ct.id, ct.start_date
          ) sub
          ORDER BY sub.start_date DESC, sub.id DESC
          """,
      countQuery = """
          SELECT COUNT(*) FROM (
              SELECT DISTINCT ct.id
              FROM class_tvms ct
              INNER JOIN class_day cd ON ct.id = cd.class_id
              WHERE ct.id NOT IN (
                  SELECT cd.class_id
                  FROM class_day cd
                  JOIN class_tvms ct2 ON cd.class_id = ct2.id
                  WHERE cd.class_date >= CURRENT_DATE
                     OR ct2.start_date > CURRENT_DATE
              )
              AND ct.is_delete = false
              AND (
                  ct.code ILIKE CONCAT('%', :searchString, '%')
                  OR ct.class_name ILIKE CONCAT('%', :searchString, '%')
              )
              AND (
                  ct.staff_id = :staffId OR cd.teacher_id = :staffId
              )
          ) count_sub
          """,
      nativeQuery = true
  )
  Page<ClassArise> searchEndedClassByStaff(
      @Param("searchString") String searchString,
      @Param("staffId") int staffId,
      Pageable pageable
  );


  List<ClassArise> findAllByCourseAndIsDeleteFalse(Course course);

  @Query(value = """
        select distinct ct.*
        from class_tvms ct
        join class_day cd
        on cd.class_id = ct.id
        where
        cd.class_date > CURRENT_DATE
        and
        (cd.class_date >= :startDate and cd.class_date <= :endDate)
        and
        ct.is_delete = false
      """, nativeQuery = true)
  List<ClassArise> findAllByClassDayRange(@Param("startDate") Date startDate,
      @Param("endDate") Date endDate);

  @Query(value = """
      SELECT
        ct.*
      FROM class_tvms ct
          LEFT JOIN class_day cd ON ct.id = cd.class_id
      WHERE
          ct.is_delete = false
      GROUP BY ct.id, ct.code, ct.course_id, ct.start_date, ct.created_at,
               ct.updated_at, ct.created_by, ct.updated_by, ct.is_delete,
               ct.class_name, ct.staff_id
      HAVING
          (MIN(cd.class_date) < :startDate AND MAX(cd.class_date) < :endDate) OR
          (MIN(cd.class_date) > :startDate AND MAX(cd.class_date) < :endDate) OR
          (MIN(cd.class_date) < :startDate AND MAX(cd.class_date) > :endDate) OR
          (MIN(cd.class_date) > :startDate AND MAX(cd.class_date) < :endDate);
      """, nativeQuery = true)
  List<ClassArise> findAllByClassDayRangeOverlaping(@Param("startDate") Date startDate,
      @Param("endDate") Date endDate);

  List<ClassArise> findAllByIsDeleteFalse();
}
