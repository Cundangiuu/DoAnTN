package vn.codezx.triviet.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.entities.reporting.AutomatedReport;

@Repository
public interface AutomatedReportRepository extends JpaRepository<AutomatedReport, Integer> {

}
