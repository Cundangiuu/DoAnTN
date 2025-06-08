package vn.codezx.triviet.controllers.setting;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.SortDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.location.LocationDTO;
import vn.codezx.triviet.dtos.location.LocationRequest;
import vn.codezx.triviet.services.LocationService;

@RestController
@RequestMapping(value = "/api/settings/locations", produces = MediaType.APPLICATION_JSON_VALUE)
public class LocationController {
  private final LocationService locationService;

  LocationController(LocationService locationService) {
    this.locationService = locationService;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<LocationDTO> createLocation(@PathVariable("request-id") String requestId,
      @RequestBody LocationRequest locationRequest) {
    return ResponseEntity.ok(locationService.createLocation(requestId, locationRequest));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<LocationDTO>> getLocations(
      @PathVariable("request-id") String requestId, @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(locationService.getLocations(requestId, pageable));
  }

  @GetMapping("/{request-id}/{location-id}")
  public ResponseEntity<LocationDTO> getLocation(@PathVariable("request-id") String requestId,
      @PathVariable("location-id") Integer locationId) {
    return ResponseEntity.ok(locationService.getLocation(requestId, locationId));
  }

  @PutMapping("/{request-id}/{location-id}")
  public ResponseEntity<LocationDTO> updateLocation(@PathVariable("request-id") String requestId,
      @PathVariable("location-id") Integer locationId,
      @RequestBody LocationRequest locationRequest) {
    return ResponseEntity
        .ok(locationService.updateLocation(requestId, locationId, locationRequest));
  }

  @DeleteMapping("/{request-id}/{location-id}")
  public ResponseEntity<LocationDTO> deleteLocation(@PathVariable("request-id") String requestId,
      @PathVariable("location-id") Integer locationId) {
    return ResponseEntity.ok(locationService.deleteLocation(requestId, locationId));
  }
}
