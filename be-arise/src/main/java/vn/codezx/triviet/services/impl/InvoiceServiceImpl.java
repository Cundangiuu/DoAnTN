package vn.codezx.triviet.services.impl;

import java.math.BigInteger;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;
import vn.codezx.triviet.config.AuditInfoListener;
import vn.codezx.triviet.constants.InvoiceStatus;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.constants.PaymentTypeConstants;
import vn.codezx.triviet.dtos.invoice.InVoiceDTO;
import vn.codezx.triviet.dtos.invoice.InvoiceReportDTO;
import vn.codezx.triviet.dtos.invoice.InvoiceRequest;
import vn.codezx.triviet.dtos.invoice.UnpaidTuitionSummary;
import vn.codezx.triviet.entities.course.ClassTvms;
import vn.codezx.triviet.entities.reporting.Invoice;
import vn.codezx.triviet.entities.staff.Staff;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.invoice.InvoiceToDTOMapper;
import vn.codezx.triviet.repositories.ClassTvmsRepository;
import vn.codezx.triviet.repositories.InvoiceRepository;
import vn.codezx.triviet.repositories.StaffRepository;
import vn.codezx.triviet.services.InvoiceService;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Service
@Slf4j
@RequiredArgsConstructor
public class InvoiceServiceImpl implements InvoiceService {

  private final AuditInfoListener auditInfoListener;
  private final StaffRepository staffRepository;
  private final InvoiceRepository invoiceRepository;
  private final InvoiceToDTOMapper invoiceToDTOMapper;
  private final ClassTvmsRepository classTvmsRepository;
  private final MessageUtil messageUtil;

  @Override
  @Transactional(readOnly = true)
  public List<InVoiceDTO> getInvoiceByStudent(String requestId, String studentCode) {
    List<Invoice> invoiceGroup = invoiceRepository.findByStudentCode(studentCode);
    if (ObjectUtils.isEmpty(invoiceGroup)) {
      return Collections.emptyList();
    }
    List<InVoiceDTO> inVoiceDTOS = invoiceToDTOMapper.toListDto(invoiceGroup);

    List<String> classCodes = inVoiceDTOS.stream().map(InVoiceDTO::getClassCode).toList();

    Map<String, String> classCodeToNameMap =
        classTvmsRepository.findAllByCodeInAndIsDeleteFalse(classCodes).stream()
            .collect(Collectors.toMap(ClassTvms::getCode, ClassTvms::getName));

    inVoiceDTOS.forEach(invoice -> {
      String className = classCodeToNameMap.get(invoice.getClassCode());
      if (className == null) {
        throw new TveException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND));
      }
      invoice.setClassName(className);
    });
    return inVoiceDTOS;
  }

  @Override
  @Transactional(readOnly = true)
  public Page<InVoiceDTO> getInvoice(String requestId, String searchString,
      List<InvoiceStatus> filter, List<PaymentTypeConstants> moneyType, Pageable pageable,
      Date updatedAtFrom, Date updatedAtTo) {
    Page<Invoice> invoicePage;
    if (updatedAtFrom == null && updatedAtTo == null) {
      invoicePage = StringUtils.hasText(searchString)
          ? invoiceRepository.searchInvoice(searchString, filter, pageable, moneyType)
          : invoiceRepository.searchInvoiceWithoutSearchString(filter, pageable, moneyType);
    } else {
      invoicePage = StringUtils.hasText(searchString)
          ? invoiceRepository.searchInvoice(searchString, filter, updatedAtFrom, updatedAtTo,
          pageable, moneyType)
          : invoiceRepository.searchInvoiceWithoutSearchStringWithDates(filter, updatedAtFrom,
              updatedAtTo, pageable, moneyType);
    }

    List<InVoiceDTO> inVoiceDTOS = invoiceToDTOMapper.toListDto(invoicePage.getContent());
    List<String> classCodes = inVoiceDTOS.stream().map(InVoiceDTO::getClassCode).toList();

    Map<String, String> classCodeToNameMap =
        classTvmsRepository.findAllByCodeInAndIsDeleteFalse(classCodes).stream()
            .collect(Collectors.toMap(ClassTvms::getCode, ClassTvms::getName));

    inVoiceDTOS.forEach(invoice -> {
      String className = classCodeToNameMap.get(invoice.getClassCode());
      if (className == null) {
        throw new TveException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND));
      }
      invoice.setClassName(className);
    });
    return new PageImpl<>(inVoiceDTOS, pageable, invoicePage.getTotalElements());
  }

  @Override
  @Transactional(readOnly = true)
  public List<InVoiceDTO> getInvoiceExport(String requestId, String searchString,
      List<InvoiceStatus> filter, List<PaymentTypeConstants> moneyType,
      Date updatedAtFrom, Date updatedAtTo) {

    List<Invoice> invoices;

    if (updatedAtFrom == null && updatedAtTo == null) {
      invoices = StringUtils.hasText(searchString)
          ? invoiceRepository.searchInvoiceForExport(searchString, filter, moneyType)
          : invoiceRepository.searchInvoiceWithoutSearchStringForExport(filter, moneyType);
    } else {
      invoices = StringUtils.hasText(searchString)
          ? invoiceRepository.searchInvoiceForExport(searchString, filter, updatedAtFrom,
          updatedAtTo, moneyType)
          : invoiceRepository.searchInvoiceWithoutSearchStringWithDatesForExport(filter,
              updatedAtFrom, updatedAtTo, moneyType);
    }

    List<InVoiceDTO> inVoiceDTOS = invoiceToDTOMapper.toListDto(invoices);
    List<String> classCodes = inVoiceDTOS.stream().map(InVoiceDTO::getClassCode).toList();

    Map<String, ClassTvms> classCodeToEntityMap =
        classTvmsRepository.findAllByCodeInAndIsDeleteFalse(classCodes).stream()
            .collect(Collectors.toMap(ClassTvms::getCode, Function.identity()));

    inVoiceDTOS.forEach(invoice -> {
      ClassTvms classEntity = classCodeToEntityMap.get(invoice.getClassCode());
      if (classEntity == null) {
        throw new TveException(requestId, messageUtil.getMessage(MessageCode.MESSAGE_CLA_NOTFOUND));
      }
      invoice.setClassName(classEntity.getName());
      invoice.setStartDate(classEntity.getStartDate());
    });

    return inVoiceDTOS;
  }


  @Override
  @Transactional(readOnly = true)
  public InVoiceDTO getInvoiceById(String requestId, int invoiceId) {
    Optional<Invoice> invoiceOptional = invoiceRepository.findById(invoiceId);
    if (invoiceOptional.isEmpty()) {
      throw new TveException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_INVOICE_NOT_FOUND));
    }
    InVoiceDTO inVoiceDTO = invoiceToDTOMapper.toDto(invoiceOptional.get());
    List<Invoice> enrollmentInvoices =
        invoiceRepository.getInvoiceByEnrollmentId(invoiceOptional.get().getEnrollment().getId());

    for (int i = 0; i < enrollmentInvoices.size(); i++) {
      if (enrollmentInvoices.get(i).getId() == invoiceId) {
        inVoiceDTO.setInvoiceAttempt(i + 1);
      }
    }
    Optional<ClassTvms> classTvms =
        classTvmsRepository.findByCodeAndIsDeleteFalse(inVoiceDTO.getClassCode());
    classTvms.ifPresent(tvms -> {
      inVoiceDTO.setClassName(tvms.getName());
    });

    Optional<String> userEmail = auditInfoListener.auditorAware().getCurrentAuditor();
    if (userEmail.isPresent()) {
      Staff staff = staffRepository.findByEmailAddressAndIsDeleteIsFalse(userEmail.get());
      inVoiceDTO.setStaffName(staff.getFirstName() + " " + staff.getLastName());
    }

    return inVoiceDTO;
  }


  @Override
  @Transactional
  public InVoiceDTO updateInvoice(String requestId, InvoiceRequest invoiceRequest) {
    Optional<Invoice> invoiceOptional = invoiceRepository.findById(invoiceRequest.getInvoiceId());
    if (invoiceOptional.isEmpty()) {
      throw new TveException(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_INVOICE_NOT_FOUND));
    }
    Invoice entity = invoiceOptional.get();

    if (!ObjectUtils.isEmpty(invoiceRequest.getAmount())) {
      entity.setAmount(invoiceRequest.getAmount());
    }
    entity.setDescription(invoiceRequest.getDescription());

    entity.setPaymentType(invoiceRequest.getPaymentType());

    if (!ObjectUtils.isEmpty(invoiceRequest.getInvoiceDiscount())) {
      if (invoiceRequest.getInvoiceDiscount() > entity.getTuitionOwed()) {
        var message = LogUtil.buildFormatLog(requestId, messageUtil.getMessage(
            MessageCode.MESSAGE_INVOICE_DISCOUNT_INVALID, invoiceRequest.getInvoiceId()));
        throw new TveException(MessageCode.MESSAGE_INVOICE_DISCOUNT_INVALID, message);
      } else {
        entity.setInvoiceDiscount(invoiceRequest.getInvoiceDiscount());
      }
    }
    if (entity.getAmount() == 0) {
      entity.setInvoiceStatus(InvoiceStatus.NOT_PAID);
    } else if (entity.getAmount() + entity.getInvoiceDiscount() < entity.getTuitionOwed()) {
      entity.setInvoiceStatus(InvoiceStatus.PARTIALLY_PAID);
    } else {
      entity.setInvoiceStatus(InvoiceStatus.FULLY_PAID);
    }

    invoiceRepository.save(entity);

    return invoiceToDTOMapper.toDto(entity);
  }

  @Override
  @Transactional(readOnly = true)
  public InvoiceReportDTO getInvoiceReport(String requestId, Date updatedAtFrom, Date updatedAtTo) {
    UnpaidTuitionSummary unpaidTuitionSummary;
    Double weeklyRevenue;
    if (updatedAtFrom == null && updatedAtTo == null) {
      unpaidTuitionSummary = invoiceRepository.getUnpaidTuitionSummary();
      weeklyRevenue = invoiceRepository.getWeeklyRevenue();
    } else {
      unpaidTuitionSummary =
          invoiceRepository.getUnpaidTuitionSummaryWithDate(updatedAtFrom, updatedAtTo);
      weeklyRevenue = invoiceRepository.getWeeklyRevenueWithDate(updatedAtFrom, updatedAtTo);
    }

    return InvoiceReportDTO.builder().studentOwed(unpaidTuitionSummary.getStudentCount())
        .totalDebt(unpaidTuitionSummary.getTotalTuitionOwed()).weeklyRevenue(weeklyRevenue).build();
  }

  @Override
  public List<InVoiceDTO> getInvoiceByClassId(String requestId, int classId) {
    return invoiceRepository.findAllByClassId(classId).stream().map(invoiceToDTOMapper::toDto)
        .toList();
  }
}
