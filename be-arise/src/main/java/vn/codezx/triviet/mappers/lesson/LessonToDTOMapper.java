package vn.codezx.triviet.mappers.lesson;

import java.util.Objects;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import vn.codezx.triviet.dtos.lesson.LessonDTO;
import vn.codezx.triviet.entities.course.Lesson;
import vn.codezx.triviet.mappers.DtoMapper;
import vn.codezx.triviet.mappers.TestType.TestTypeToDTOMapper;

@Component
@RequiredArgsConstructor
public class LessonToDTOMapper extends DtoMapper<Lesson, LessonDTO> {

  private final TestTypeToDTOMapper testTypeToDTOMapper;

  @Override
  public LessonDTO toDto(Lesson entity) {
    return LessonDTO.builder().id(entity.getId()).description(entity.getDescription())
        .lessonType(Objects.isNull(entity.getLessonType()) ? null
            : testTypeToDTOMapper.toDto(entity.getLessonType()).getType())
        .isDelete(entity.getIsDelete())
        .courseCode(entity.getCourse().getCode())
        .createdAt(entity.getCreatedAt()).updatedAt(entity.getUpdatedAt())
        .createdBy(entity.getCreatedBy()).updatedBy(entity.getUpdatedBy()).build();
  }
}
