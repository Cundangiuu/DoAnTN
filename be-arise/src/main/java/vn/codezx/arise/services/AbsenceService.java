package vn.codezx.arise.services;

import java.util.Date;
import java.util.List;
import vn.codezx.arise.dtos.absence.AbsenceDTO;
import vn.codezx.arise.dtos.absence.AbsenceRequest;
import vn.codezx.arise.dtos.fileexport.DownloadDTO;

public interface AbsenceService {

  AbsenceDTO markAbsence(String requestId, AbsenceRequest attendanceRequest);

  List<AbsenceDTO> getAbsentGroup(String requestId);

  List<AbsenceDTO> getAbsenceByClass(String requestId, String classCode);

  List<AbsenceDTO> getStudentAbsence(String requestId, String studentCode);

  DownloadDTO absenceDayReport(String requestId, Date from, Date to);
}
