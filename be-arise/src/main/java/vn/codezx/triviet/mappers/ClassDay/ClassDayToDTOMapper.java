package vn.codezx.triviet.mappers.ClassDay;

import java.util.Objects;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import vn.codezx.triviet.dtos.classDay.ClassDayDTO;
import vn.codezx.triviet.entities.course.ClassDay;
import vn.codezx.triviet.mappers.DtoMapper;
import vn.codezx.triviet.mappers.absence.AbsenceToDTOMapper;
import vn.codezx.triviet.mappers.lesson.LessonToDTOMapper;
import vn.codezx.triviet.mappers.setting.LocationToDTOMapper;
import vn.codezx.triviet.mappers.setting.ScheduleToDTOMapper;
import vn.codezx.triviet.mappers.staff.StaffToDTOMapper;

@Component
@RequiredArgsConstructor
public class ClassDayToDTOMapper extends DtoMapper<ClassDay, ClassDayDTO> {
    private final LessonToDTOMapper lessonToDTOMapper;
    private final StaffToDTOMapper staffToDTOMapper;
    private final LocationToDTOMapper locationToDTOMapper;
    private final AbsenceToDTOMapper absenceToDTOMapper;
    private final ScheduleToDTOMapper scheduleToDTOMapper;


    @Override
    public ClassDayDTO toDto(ClassDay entity) {

        return ClassDayDTO.builder().id(entity.getId()).classDate(entity.getClassDate())
                .lesson(lessonToDTOMapper.toDto(entity.getLesson())).comment(entity.getComment())
                .teacher(Objects.isNull(entity.getTeacher()) ? null
                        : staffToDTOMapper.toDto(entity.getTeacher()))
                .location(Objects.isNull(entity.getLocation()) ? null
                        : locationToDTOMapper.toDto(entity.getLocation()))
                .absence(Objects.isNull(entity.getAttendances()) ? null
                        : absenceToDTOMapper.toListDto(entity.getAttendances()))
                .isFinal(entity.getIsFinal()).classTvms(entity.getClassTvms().getCode())
                .isMidterm(entity.getIsMidterm()).className(entity.getClassTvms().getName())
                .schedule(Objects.isNull(entity.getSchedule()) ? null
                        : scheduleToDTOMapper.toDto(entity.getSchedule()))
                .homeWork(entity.getHomeWork()).rating(entity.getRating()).build();
    }
}
