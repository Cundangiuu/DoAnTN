package vn.codezx.triviet.dtos.reports;

import java.util.LinkedHashMap;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class AbsenceReportDTO extends BaseReportType{
  String enrolledClass;
  String absentDate;
  String studentName;
  String lessonDescription;
  String comment;
  String homeWork;
  String nickName;


  @Override
  public LinkedHashMap<String, String> getHeaders() {
    var map = new LinkedHashMap<String, String>();
    map.put("Enrolled Class", "enrolledClass");
    map.put("Absent Date", "absentDate");
    map.put("Student Name", "studentName");
    map.put("Nick Name", "nickName");
    map.put("Lesson Description", "lessonDescription");
    map.put("Comment", "comment");
    map.put("Homework", "homeWork");
    return map;
  }
}
