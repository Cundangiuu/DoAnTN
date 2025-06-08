package vn.codezx.triviet.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.triviet.dtos.location.LocationDTO;
import vn.codezx.triviet.dtos.location.LocationRequest;

public interface LocationService {
  LocationDTO createLocation(String requestId, LocationRequest locationRequest);

  Page<LocationDTO> getLocations(String requestId, Pageable pageable);

  LocationDTO getLocation(String requestId, Integer locationId);

  LocationDTO updateLocation(String requestId, Integer locationId, LocationRequest locationRequest);

  LocationDTO deleteLocation(String requestId, Integer locationId);
}
