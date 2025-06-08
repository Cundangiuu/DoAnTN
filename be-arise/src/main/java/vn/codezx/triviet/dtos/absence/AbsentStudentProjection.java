package vn.codezx.triviet.dtos.absence;

import java.util.Date;

public interface AbsentStudentProjection {

  String getEnrolledClass();

  Date getAbsentDate();

  String getStudentName();

  String getLessonDescription();
  String getComment();
  String getHomeWork();
  String getNickName();
}
