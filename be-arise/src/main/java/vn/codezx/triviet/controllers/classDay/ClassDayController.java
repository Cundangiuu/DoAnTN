package vn.codezx.triviet.controllers.classDay;

import java.util.Date;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.format.annotation.DateTimeFormat.ISO;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.classDay.ClassDayDTO;
import vn.codezx.triviet.dtos.classDay.ClassDayRequest;
import vn.codezx.triviet.dtos.classDay.UpdateClassDayDTO;
import vn.codezx.triviet.services.ClassDayService;


@RestController
@RequestMapping("/api/class-day")
@RequiredArgsConstructor
public class ClassDayController {

  private final ClassDayService classDayService;

  @GetMapping("{request-id}/{id}")
  public ResponseEntity<ClassDayDTO> getClassDayById(@PathVariable("request-id") String requestId,
      @PathVariable("id") Integer classDayId) {
    return ResponseEntity.ok(classDayService.getClassDayById(requestId, classDayId));
  }

  @PutMapping("{request-id}/{id}")
  public ResponseEntity<ClassDayDTO> updateClassDayById(
      @RequestBody ClassDayRequest classDayRequest, @PathVariable("request-id") String requestId,
      @PathVariable("id") Integer classDayId) {
    return ResponseEntity
        .ok(classDayService.updateClassDayById(requestId, classDayId, classDayRequest));
  }

  @PutMapping("{request-id}")
  public ResponseEntity<ClassDayDTO> updateClassDay(@PathVariable("request-id") String requestId,
      @RequestBody UpdateClassDayDTO updateClassDay) {
    return ResponseEntity.ok(classDayService.updateClassDay(requestId, updateClassDay));
  }

  @GetMapping("test-day-report/{request-id}")
  public ResponseEntity<Resource> getTestDayReport(@PathVariable("request-id") String requestId,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(required = true) Date from,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(required = true) Date to) {
    var data = classDayService.testDayReport(requestId, from, to);

    var headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDisposition(
        ContentDisposition.attachment().filename(data.getFilename()).build());
    return ResponseEntity.ok().headers(headers).body(data.getResource());
  }

}
