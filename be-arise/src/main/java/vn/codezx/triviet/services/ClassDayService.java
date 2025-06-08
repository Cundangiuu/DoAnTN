package vn.codezx.triviet.services;

import java.util.Date;
import java.util.List;
import vn.codezx.triviet.dtos.classDay.ClassDayDTO;
import vn.codezx.triviet.dtos.classDay.ClassDayRequest;
import vn.codezx.triviet.dtos.classDay.UpdateClassDayDTO;
import vn.codezx.triviet.dtos.fileexport.DownloadDTO;
import vn.codezx.triviet.entities.course.ClassTvms;

public interface ClassDayService {

  ClassDayDTO getClassDayById(String requestId, Integer classDayId);

  ClassDayDTO updateClassDayById(String requestId, Integer classDayId,
      ClassDayRequest classDayRequest);

  List<ClassDayDTO> generateClassDay(String requestId, ClassTvms classTvms, boolean withoutRecent);

  ClassDayDTO updateClassDay(String requestId, UpdateClassDayDTO updateClassDayDTO);

  DownloadDTO testDayReport(String requestId, Date from, Date to);
}
