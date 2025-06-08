package vn.codezx.triviet.services;

import java.util.List;
import vn.codezx.triviet.dtos.enrollment.EnrollmentDTO;
import vn.codezx.triviet.dtos.enrollment.EnrollmentRequest;

public interface EnrollmentService {

  List<EnrollmentDTO> addEnrollment(String requestId, List<EnrollmentRequest> request);

  EnrollmentDTO deleteEnrollment(String requestId, int enrollmentId);

  List<EnrollmentDTO> getListEnrollment(String requestId, String courseCode, String classCode);

  List<EnrollmentDTO> getListEnrollmentByStudent(String requestId, String studentCode);

  EnrollmentDTO updateEnrollment(String requestId, int enrollmentId, EnrollmentRequest request);
}
