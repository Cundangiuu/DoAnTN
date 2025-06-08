package vn.codezx.arise.dtos.reports;

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
public class TestDayReportDTO extends BaseReportType {
    String name;
    String testDate;
    String testType;
    String schedule;
    String location;

    @Override
    public LinkedHashMap<String, String> getHeaders() {
        var map = new LinkedHashMap<String, String>();
        map.put("Name", "name");
        map.put("Test Date", "testDate");
        map.put("Test Type", "testType");
        map.put("Schedule", "schedule");
        map.put("Location", "location");
        return map;
    }
}
