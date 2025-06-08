package vn.codezx.triviet.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.triviet.dtos.formula.FormulaDTO;
import vn.codezx.triviet.dtos.formula.FormulaRequest;

public interface FormulaService {

  FormulaDTO createFormula(String requestId, FormulaRequest formulaDTO);

  FormulaDTO getFormula(String requestId, Integer formulaId);

  FormulaDTO updateFormula(String requestId, Integer formulaId, FormulaRequest formulaDTO);

  FormulaDTO deleteFormula(String requestId, Integer formulaId);

  Page<FormulaDTO> getFormulas(String requestId, Pageable pageable);
}
