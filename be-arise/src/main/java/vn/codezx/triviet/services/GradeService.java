package vn.codezx.triviet.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.triviet.constants.TypeOfTest;
import vn.codezx.triviet.dtos.grade.GradeDTO;
import vn.codezx.triviet.dtos.grade.GradeRequest;


public interface GradeService {

  GradeDTO createGrade(String requestId, GradeRequest gradeRequest);

  Page<GradeDTO> getGradesByStudentId(String requestId, Integer studentId, TypeOfTest typeOfTest,
      Integer classId, Pageable pageable);

  Page<GradeDTO> getGradesByClassId(String requestId, Integer classId, TypeOfTest typeOfTest,
      Pageable pageable);

  GradeDTO getGrade(String requestId, Integer gradeId);

  GradeDTO updateGrade(String requestId, Integer gradeId, GradeRequest gradeRequest);

  GradeDTO deleteGrade(String requestId, Integer gradeId);

  List<GradeDTO> generateClassGrade(String requestId, String classCode, TypeOfTest testType);
}
