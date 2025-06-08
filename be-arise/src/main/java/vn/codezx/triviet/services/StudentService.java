package vn.codezx.triviet.services;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import vn.codezx.triviet.dtos.grade.StudentGradeDTO;
import vn.codezx.triviet.dtos.student.StudentDTO;
import vn.codezx.triviet.dtos.student.StudentRequest;
import vn.codezx.triviet.entities.student.Student;

public interface StudentService {

  public StudentDTO createStudent(String requestId, StudentRequest studentRequest,
      MultipartFile avatar);

  public Page<StudentDTO> getStudents(String requestId, String query, String hasAvatar,
      Pageable pageable);

  public StudentDTO getStudent(String requestId, String studentCode);

  public StudentDTO updateStudent(String requestId, Integer studentId,
      StudentRequest studentRequest, MultipartFile avatar);

  public StudentDTO deleteStudent(String requestId, Integer studentId);

  List<StudentDTO> getPreEnrollmentStudent(String requestId);

  public String storeAvatar(String requestId, Student student, MultipartFile file);

  Integer getTotalStudent(String requestId);

  List<StudentDTO> getStudentsByClassCode(String requestId, String classCode);

  List<StudentGradeDTO> getGradeOfStudent(Integer studentId);

  Page<StudentDTO> getStudentsWithoutDebt(String requestId, String query, Pageable pageable);

  List<StudentDTO> exportStudents(String requestId, String query, String hasAvatar);

  StudentDTO getStudentById(String requestId, Integer id);
}
