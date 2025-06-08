package vn.codezx.arise.mappers.setting;

import java.util.List;
import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.location.LocationDTO;
import vn.codezx.arise.entities.setting.Location;
import vn.codezx.arise.mappers.DtoMapper;

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
