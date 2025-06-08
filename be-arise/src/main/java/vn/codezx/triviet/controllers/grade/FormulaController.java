package vn.codezx.triviet.controllers.grade;

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
import vn.codezx.triviet.dtos.formula.FormulaDTO;
import vn.codezx.triviet.dtos.formula.FormulaRequest;
import vn.codezx.triviet.services.FormulaService;


@RestController
@RequestMapping(value = "/api/settings/formulas", produces = MediaType.APPLICATION_JSON_VALUE)
public class FormulaController {
  private final FormulaService formulaService;

  public FormulaController(FormulaService formulaService) {
    this.formulaService = formulaService;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<FormulaDTO> createFormula(@PathVariable("request-id") String requestId,
      @RequestBody FormulaRequest formulaRequest) {
    return ResponseEntity.ok(formulaService.createFormula(requestId, formulaRequest));
  }

  @GetMapping("/{request-id}/{formula-id}")
  public ResponseEntity<FormulaDTO> getFormulaById(@PathVariable("request-id") String requestId,
      @PathVariable("formula-id") Integer formulaId) {
    return ResponseEntity.ok(formulaService.getFormula(requestId, formulaId));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<FormulaDTO>> getFormulas(@PathVariable("request-id") String requestId,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(formulaService.getFormulas(requestId, pageable));
  }

  @PutMapping("/{request-id}/{formula-id}")
  public ResponseEntity<FormulaDTO> updateFormula(@PathVariable("request-id") String requestId,
      @PathVariable("formula-id") Integer formulaId, @RequestBody FormulaRequest formulaRequest) {
    FormulaDTO formulaDTO = formulaService.updateFormula(requestId, formulaId, formulaRequest);
    return ResponseEntity.ok(formulaDTO);
  }

  @DeleteMapping("/{request-id}/{formula-id}")
  public ResponseEntity<FormulaDTO> deleteFormula(@PathVariable("request-id") String requestId,
      @PathVariable("formula-id") Integer formulaId) {
    return ResponseEntity.ok(formulaService.deleteFormula(requestId, formulaId));
  }
}
