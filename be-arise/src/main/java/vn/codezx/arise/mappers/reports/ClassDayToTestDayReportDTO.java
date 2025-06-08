package vn.codezx.arise.mappers.reports;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Objects;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.arise.dtos.reports.TestDayReportDTO;
import vn.codezx.arise.entities.course.ClassDay;
import vn.codezx.arise.mappers.DtoMapper;

@Component
@RequiredArgsConstructor
@Slf4j
public class ClassDayToTestDayReportDTO extends DtoMapper<ClassDay, TestDayReportDTO> {


    @Override
    public TestDayReportDTO toDto(ClassDay entity) {
        String pattern = "dd/MM/yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        Calendar cal = Calendar.getInstance();
        cal.setTime(entity.getClassDate());

        var location = new StringBuilder();

        if (!Objects.isNull(entity.getLocation())) {
            location.append(entity.getLocation().getBranch()).append(" ")
                    .append(entity.getLocation().getRoom());
        }

        var schedule = new StringBuilder();

        if (!Objects.isNull(entity.getSchedule())) {
            schedule.append(entity.getSchedule().getCode());
        }

        return TestDayReportDTO.builder().name(entity.getClassArise().getName())
                .testDate(simpleDateFormat.format(entity.getClassDate()))
                .schedule(schedule.toString())
                .testType(entity.getLesson().getLessonType().getType().name())
                .location(location.toString()).build();
    }

}
