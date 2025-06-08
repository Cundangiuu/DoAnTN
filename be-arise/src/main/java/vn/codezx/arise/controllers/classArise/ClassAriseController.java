package vn.codezx.arise.controllers.classArise;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.SortDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.arise.constants.ClassStatus;
import vn.codezx.arise.dtos.classArise.ClassDTO;
import vn.codezx.arise.dtos.classArise.CreateClassDTO;
import vn.codezx.arise.dtos.classArise.UpdateClassDTO;
import vn.codezx.arise.services.ClassAriseService;



@RestController
@RequestMapping("/api/classes")
public class ClassAriseController {

  private final ClassAriseService classAriseService;

  public ClassAriseController(ClassAriseService classArise) {
    this.classAriseService = classArise;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<ClassDTO> addClass(@PathVariable("request-id") String requestId,
      @RequestBody CreateClassDTO classArise) {
    return ResponseEntity.ok(classAriseService.createClass(requestId, classArise));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<ClassDTO>> getClass(@PathVariable("request-id") String requestId,
      @RequestParam(required = false) Integer staffId, @RequestParam String searchString,
      @RequestParam(required = false) ClassStatus status, @ParameterObject Pageable pageable) {
    return ResponseEntity
        .ok(classAriseService.getClass(requestId, searchString, status, staffId, pageable));
  }

  @GetMapping("/{request-id}/{code}")
  public ResponseEntity<ClassDTO> getClass(@PathVariable("request-id") String requestId,
      @PathVariable String code) {
    return ResponseEntity.ok(classAriseService.getClass(requestId, code));
  }

  @PutMapping("{request-id}/{id}")
  public ResponseEntity<ClassDTO> updateClass(@PathVariable("request-id") String requestId,
      @PathVariable int id, @RequestBody UpdateClassDTO updateClassDTO) {
    return ResponseEntity.ok(classAriseService.updateClass(requestId, id, updateClassDTO));
  }

  @DeleteMapping("{request-id}/{id}")
  public ResponseEntity<Void> deleteClass(@PathVariable("request-id") String requestId,
      @PathVariable int id) {
    classAriseService.deleteClass(requestId, id);

    return ResponseEntity.ok().build();
  }

  @GetMapping("/{request-id}/total")
  public ResponseEntity<Integer> getTotalNumberStudent(
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(classAriseService.getTotalClass(requestId));
  }
}

