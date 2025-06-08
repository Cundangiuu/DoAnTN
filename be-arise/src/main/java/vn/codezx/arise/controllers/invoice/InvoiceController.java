package vn.codezx.arise.controllers.invoice;

import java.util.Date;
import java.util.List;
import lombok.RequiredArgsConstructor;
import vn.codezx.arise.constants.InvoiceStatus;
import vn.codezx.arise.constants.PaymentTypeConstants;
import vn.codezx.arise.dtos.invoice.InVoiceDTO;
import vn.codezx.arise.dtos.invoice.InvoiceReportDTO;
import vn.codezx.arise.dtos.invoice.InvoiceRequest;
import vn.codezx.arise.services.InvoiceService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.SortDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/invoice")
@RequiredArgsConstructor
public class InvoiceController {

  private final InvoiceService invoiceService;

  @GetMapping("{request-id}/{student-code}/student")
  public ResponseEntity<List<InVoiceDTO>> getInvoiceByStudent(
      @PathVariable("request-id") String requestId,
      @PathVariable("student-code") String studentCode) {
    return ResponseEntity.ok(invoiceService.getInvoiceByStudent(requestId, studentCode));
  }

  @GetMapping("{request-id}/{id}")
  public ResponseEntity<InVoiceDTO> getInvoiceById(@PathVariable("request-id") String requestId,
      @PathVariable("id") int invoiceId) {
    return ResponseEntity.ok(invoiceService.getInvoiceById(requestId, invoiceId));
  }

  @GetMapping("{request-id}")
  public ResponseEntity<Page<InVoiceDTO>> getInvoice(@PathVariable("request-id") String requestId,
      @RequestParam(required = false) String searchString,
      @RequestParam(required = false) List<InvoiceStatus> filter,
      @RequestParam(required = false) List<PaymentTypeConstants> moneyType,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(
          required = false) Date updatedAtFrom,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(
          required = false) Date updatedAtTo,
      @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(invoiceService.getInvoice(requestId, searchString, filter, moneyType,
        pageable, updatedAtFrom, updatedAtTo));
  }

  @GetMapping("{request-id}/export")
  public ResponseEntity<List<InVoiceDTO>> getInvoiceExport(
      @PathVariable("request-id") String requestId,
      @RequestParam(required = false) String searchString,
      @RequestParam(required = false) List<InvoiceStatus> filter,
      @RequestParam(required = false) List<PaymentTypeConstants> moneyType,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(
          required = false) Date updatedAtFrom,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(
          required = false) Date updatedAtTo) {
    return ResponseEntity.ok(
        invoiceService.getInvoiceExport(requestId, searchString, filter, moneyType, updatedAtFrom,
            updatedAtTo));
  }

  @PutMapping("{request-id}")
  public ResponseEntity<InVoiceDTO> updateInvoice(@PathVariable("request-id") String requestId,
      @RequestBody InvoiceRequest invoiceRequest) {
    return ResponseEntity.ok(invoiceService.updateInvoice(requestId, invoiceRequest));
  }

  @GetMapping("{request-id}/report")
  public ResponseEntity<InvoiceReportDTO> getInvoiceReport(
      @PathVariable("request-id") String requestId,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(
          required = false) Date updatedAtFrom,
      @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam(
          required = false) Date updatedAtTo) {
    return ResponseEntity
        .ok(invoiceService.getInvoiceReport(requestId, updatedAtFrom, updatedAtTo));
  }

  @GetMapping("{request-id}/class/{class-id}")
  public ResponseEntity<List<InVoiceDTO>> getInvoiceByClassId(
      @PathVariable("request-id") String requestId, @PathVariable("class-id") int classId) {
    return ResponseEntity.ok(invoiceService.getInvoiceByClassId(requestId, classId));
  }
}
