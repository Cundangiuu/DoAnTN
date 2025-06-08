package vn.codezx.arise.mappers.ClassDay;

import java.util.Objects;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import vn.codezx.arise.dtos.classDay.ClassDayDTO;
import vn.codezx.arise.entities.course.ClassDay;
import vn.codezx.arise.mappers.DtoMapper;
import vn.codezx.arise.mappers.absence.AbsenceToDTOMapper;
import vn.codezx.arise.mappers.lesson.LessonToDTOMapper;
import vn.codezx.arise.mappers.setting.LocationToDTOMapper;
import vn.codezx.arise.mappers.setting.ScheduleToDTOMapper;
import vn.codezx.arise.mappers.staff.StaffToDTOMapper;

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
                .isFinal(entity.getIsFinal()).classArise(entity.getClassArise().getCode())
                .isMidterm(entity.getIsMidterm()).className(entity.getClassArise().getName())
                .schedule(Objects.isNull(entity.getSchedule()) ? null
                        : scheduleToDTOMapper.toDto(entity.getSchedule()))
                .homeWork(entity.getHomeWork()).rating(entity.getRating()).build();
    }
}
