package vn.codezx.triviet.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.triviet.constants.ClassStatus;
import vn.codezx.triviet.dtos.classTvms.ClassDTO;
import vn.codezx.triviet.dtos.classTvms.CreateClassDTO;
import vn.codezx.triviet.dtos.classTvms.UpdateClassDTO;

public interface ClassTvmsService {

  ClassDTO createClass(String requestId, CreateClassDTO classRequest);

  ClassDTO getClass(String requestId, int classId);

  ClassDTO getClass(String requestId, String classCode);

  ClassDTO updateClass(String requestId, int classId, UpdateClassDTO updateClassDTO);

  void deleteClass(String requestId, int classId);

  Page<ClassDTO> getClass(String requestId, String searchString, ClassStatus status,
      Integer staffId, Pageable pageable);

  Integer getTotalClass(String requestId);

}
