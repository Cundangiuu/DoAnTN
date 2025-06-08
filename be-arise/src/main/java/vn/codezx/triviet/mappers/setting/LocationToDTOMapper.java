package vn.codezx.triviet.mappers.setting;

import java.util.List;
import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.location.LocationDTO;
import vn.codezx.triviet.entities.setting.Location;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class LocationToDTOMapper extends DtoMapper<Location, LocationDTO> {

    @Override
    public LocationDTO toDto(Location entity) {
        List<Integer> scheduleIds =
                entity.getSchedules().stream().map(schedule -> schedule.getId()).toList();


        return LocationDTO.builder().id(entity.getId()).branch(entity.getBranch())
                .code(entity.getCode()).room(entity.getRoom()).scheduleIds(scheduleIds)
                .createdAt(entity.getCreatedAt()).createdBy(entity.getCreatedBy())
                .updatedAt(entity.getUpdatedAt()).updatedBy(entity.getUpdatedBy()).build();
    }
}
