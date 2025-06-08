package vn.codezx.triviet.dtos.location;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.dtos.base.BaseInfoDTO;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
public class LocationDTO extends BaseInfoDTO {
    private int id;
    private String branch;
    private String room;
    private String code;
    private List<Integer> scheduleIds;
}
