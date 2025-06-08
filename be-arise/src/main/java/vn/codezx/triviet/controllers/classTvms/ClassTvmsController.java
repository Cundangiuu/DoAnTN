package vn.codezx.triviet.controllers.classTvms;

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
import vn.codezx.triviet.constants.ClassStatus;
import vn.codezx.triviet.dtos.classTvms.ClassDTO;
import vn.codezx.triviet.dtos.classTvms.CreateClassDTO;
import vn.codezx.triviet.dtos.classTvms.UpdateClassDTO;
import vn.codezx.triviet.services.ClassTvmsService;



@RestController
@RequestMapping("/api/classes")
public class ClassTvmsController {

  private final ClassTvmsService classTvmsService;

  public ClassTvmsController(ClassTvmsService classTvms) {
    this.classTvmsService = classTvms;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<ClassDTO> addClass(@PathVariable("request-id") String requestId,
      @RequestBody CreateClassDTO classTvms) {
    return ResponseEntity.ok(classTvmsService.createClass(requestId, classTvms));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<ClassDTO>> getClass(@PathVariable("request-id") String requestId,
      @RequestParam(required = false) Integer staffId, @RequestParam String searchString,
      @RequestParam(required = false) ClassStatus status, @ParameterObject Pageable pageable) {
    return ResponseEntity
        .ok(classTvmsService.getClass(requestId, searchString, status, staffId, pageable));
  }

  @GetMapping("/{request-id}/{code}")
  public ResponseEntity<ClassDTO> getClass(@PathVariable("request-id") String requestId,
      @PathVariable String code) {
    return ResponseEntity.ok(classTvmsService.getClass(requestId, code));
  }

  @PutMapping("{request-id}/{id}")
  public ResponseEntity<ClassDTO> updateClass(@PathVariable("request-id") String requestId,
      @PathVariable int id, @RequestBody UpdateClassDTO updateClassDTO) {
    return ResponseEntity.ok(classTvmsService.updateClass(requestId, id, updateClassDTO));
  }

  @DeleteMapping("{request-id}/{id}")
  public ResponseEntity<Void> deleteClass(@PathVariable("request-id") String requestId,
      @PathVariable int id) {
    classTvmsService.deleteClass(requestId, id);

    return ResponseEntity.ok().build();
  }

  @GetMapping("/{request-id}/total")
  public ResponseEntity<Integer> getTotalNumberStudent(
      @PathVariable("request-id") String requestId) {
    return ResponseEntity.ok(classTvmsService.getTotalClass(requestId));
  }
}

