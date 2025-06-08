package vn.codezx.triviet.dtos.location;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class LocationRequest {
    private String branch;
    private String room;
    private List<Integer> scheduleIds;
}
