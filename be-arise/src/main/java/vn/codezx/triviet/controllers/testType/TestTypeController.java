package vn.codezx.triviet.controllers.testType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.services.TestTypeService;

@RestController
@RequestMapping("/api/test-types")
public class TestTypeController {

  private final TestTypeService testTypeService;

  @Autowired
  public TestTypeController(TestTypeService testTypeService) {
    this.testTypeService = testTypeService;
  }
}
