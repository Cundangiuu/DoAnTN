import { EnrollmentDTO } from "@/dtos/enrollment/EnrollmentDTO";
import { EnrollmentRequest } from "@/dtos/requests/EnrollmentRequest";

export function mapEnrollmentDTOToRequest(
  dto: EnrollmentDTO
): EnrollmentRequest {
  return {
    studentId: dto.student.id,
    courseId: dto.course,
    classCode: dto.classCode,
    enrollmentDate: dto.enrollmentDate,
  };
}
