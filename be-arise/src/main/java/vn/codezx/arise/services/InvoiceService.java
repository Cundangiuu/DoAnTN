package vn.codezx.arise.services;

import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.arise.constants.InvoiceStatus;
import vn.codezx.arise.constants.PaymentTypeConstants;
import vn.codezx.arise.dtos.invoice.InVoiceDTO;
import vn.codezx.arise.dtos.invoice.InvoiceReportDTO;
import vn.codezx.arise.dtos.invoice.InvoiceRequest;

public interface InvoiceService {

  List<InVoiceDTO> getInvoiceByStudent(String requestId, String studentCode);

  Page<InVoiceDTO> getInvoice(String requestId, String searchString, List<InvoiceStatus> filter,
      List<PaymentTypeConstants> moneyType, Pageable pageable, Date updatedAtFrom,
      Date updatedAtTo);

  List<InVoiceDTO> getInvoiceExport(String requestId, String searchString,
      List<InvoiceStatus> filter,
      List<PaymentTypeConstants> moneyType, Date updatedAtFrom,
      Date updatedAtTo);

  InVoiceDTO getInvoiceById(String requestId, int invoiceId);

  List<InVoiceDTO> getInvoiceByClassId(String requestId, int classId);

  InVoiceDTO updateInvoice(String requestId, InvoiceRequest invoiceRequest);

  InvoiceReportDTO getInvoiceReport(String requestId, Date updatedAtFrom, Date updatedAtTo);
}
