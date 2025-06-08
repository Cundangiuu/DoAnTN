package vn.codezx.triviet.dtos.staff.request;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class StaffRequest {
    private String firstName;
    private String lastName;
    private String emailAddress;
    private String phoneNumber;
    private Integer weeklyHours;
    private Integer rates;
    private List<Integer> scheduleIds;
    private List<Integer> courseIds;
    private List<Integer> roleIds;
}
