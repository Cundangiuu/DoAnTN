package vn.codezx.arise.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.arise.constants.ClassStatus;
import vn.codezx.arise.dtos.classArise.ClassDTO;
import vn.codezx.arise.dtos.classArise.CreateClassDTO;
import vn.codezx.arise.dtos.classArise.UpdateClassDTO;

public interface ClassAriseService {

  ClassDTO createClass(String requestId, CreateClassDTO classRequest);

  ClassDTO getClass(String requestId, int classId);

  ClassDTO getClass(String requestId, String classCode);

  ClassDTO updateClass(String requestId, int classId, UpdateClassDTO updateClassDTO);

  void deleteClass(String requestId, int classId);

  Page<ClassDTO> getClass(String requestId, String searchString, ClassStatus status,
      Integer staffId, Pageable pageable);

  Integer getTotalClass(String requestId);

}
