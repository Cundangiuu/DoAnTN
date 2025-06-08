package vn.codezx.arise.services;

import java.util.Date;
import java.util.List;
import vn.codezx.arise.dtos.classDay.ClassDayDTO;
import vn.codezx.arise.dtos.classDay.ClassDayRequest;
import vn.codezx.arise.dtos.classDay.UpdateClassDayDTO;
import vn.codezx.arise.dtos.fileexport.DownloadDTO;
import vn.codezx.arise.entities.course.ClassArise;

public interface ClassDayService {

  ClassDayDTO getClassDayById(String requestId, Integer classDayId);

  ClassDayDTO updateClassDayById(String requestId, Integer classDayId,
      ClassDayRequest classDayRequest);

  List<ClassDayDTO> generateClassDay(String requestId, ClassArise classArise, boolean withoutRecent);

  ClassDayDTO updateClassDay(String requestId, UpdateClassDayDTO updateClassDayDTO);

  DownloadDTO testDayReport(String requestId, Date from, Date to);
}
