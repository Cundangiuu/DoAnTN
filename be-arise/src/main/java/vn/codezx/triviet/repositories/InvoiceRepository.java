package vn.codezx.triviet.repositories;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.codezx.triviet.constants.InvoiceStatus;
import vn.codezx.triviet.constants.PaymentTypeConstants;
import vn.codezx.triviet.dtos.invoice.UnpaidTuitionSummary;
import vn.codezx.triviet.entities.reporting.Invoice;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

  @Query("SELECT i FROM Invoice i JOIN i.enrollment e WHERE e.student.code = :studentCode AND i.isDelete = false")
  List<Invoice> findByStudentCode(@Param("studentCode") String studentCode);

  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.updatedAt BETWEEN :updatedAtFrom AND :updatedAtTo "
      + "AND i.isDelete = false "
      + "AND (:searchString IS NULL OR "
      + "i.updatedBy LIKE CONCAT('%', :searchString, '%') OR "
      + "LOWER(i.enrollment.student.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(i.enrollment.classTvms.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(i.enrollment.student.nickname) LIKE LOWER(CONCAT('%', :searchString, '%'))) ORDER BY i.updatedAt DESC")
  Page<Invoice> searchInvoice(@Param("searchString") String searchString,
      @Param("filter") List<InvoiceStatus> filter, @Param("updatedAtFrom") Date updatedAtFrom,
      @Param("updatedAtTo") Date updatedAtTo, Pageable pageable,
      @Param("moneyType") List<PaymentTypeConstants> moneyType);


  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.isDelete = false "
      + "AND (:searchString IS NULL OR "
      + "i.updatedBy LIKE CONCAT('%', :searchString, '%') OR "
      + "LOWER(i.enrollment.student.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(i.enrollment.classTvms.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "CAST(i.paymentType AS string) LIKE CONCAT('%', :searchString, '%') OR "
      + "LOWER(i.enrollment.student.nickname) LIKE LOWER(CONCAT('%', :searchString, '%'))) ORDER BY i.updatedAt DESC")
  Page<Invoice> searchInvoice(@Param("searchString") String searchString,
      @Param("filter") List<InvoiceStatus> filter, Pageable pageable,
      @Param("moneyType") List<PaymentTypeConstants> moneyType);

  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.updatedAt BETWEEN :updatedAtFrom AND :updatedAtTo "
      + "AND i.isDelete = false "
      + "AND (:searchString IS NULL OR "
      + "i.updatedBy LIKE CONCAT('%', :searchString, '%') OR "
      + "LOWER(i.enrollment.student.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(i.enrollment.classTvms.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(i.enrollment.student.nickname) LIKE LOWER(CONCAT('%', :searchString, '%'))) ORDER BY i.updatedAt DESC")
  List<Invoice> searchInvoiceForExport(@Param("searchString") String searchString,
      @Param("filter") List<InvoiceStatus> filter, @Param("updatedAtFrom") Date updatedAtFrom,
      @Param("updatedAtTo") Date updatedAtTo,
      @Param("moneyType") List<PaymentTypeConstants> moneyType);


  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.isDelete = false "
      + "AND (:searchString IS NULL OR "
      + "i.updatedBy LIKE CONCAT('%', :searchString, '%') OR "
      + "LOWER(i.enrollment.student.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "LOWER(i.enrollment.classTvms.name) LIKE LOWER(CONCAT('%', :searchString, '%')) OR "
      + "CAST(i.paymentType AS string) LIKE CONCAT('%', :searchString, '%') OR "
      + "LOWER(i.enrollment.student.nickname) LIKE LOWER(CONCAT('%', :searchString, '%'))) ORDER BY i.updatedAt DESC")
  List<Invoice> searchInvoiceForExport(@Param("searchString") String searchString,
      @Param("filter") List<InvoiceStatus> filter,
      @Param("moneyType") List<PaymentTypeConstants> moneyType);


  @Query("SELECT i from Invoice i where i.enrollment.id = :enrollmentId AND i.isDelete = false order by i.createdAt")
  List<Invoice> getInvoiceByEnrollmentId(@Param("enrollmentId") int enrollmentId);

  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.isDelete = false "
      + "ORDER BY i.updatedAt DESC")
  Page<Invoice> searchInvoiceWithoutSearchString(@Param("filter") List<InvoiceStatus> filter,
      Pageable pageable, @Param("moneyType") List<PaymentTypeConstants> moneyType);

  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.updatedAt BETWEEN :updatedAtFrom AND :updatedAtTo "
      + "AND i.isDelete = false "
      + "ORDER BY i.updatedAt DESC")
  Page<Invoice> searchInvoiceWithoutSearchStringWithDates(
      @Param("filter") List<InvoiceStatus> filter, @Param("updatedAtFrom") Date updatedAtFrom,
      @Param("updatedAtTo") Date updatedAtTo, Pageable pageable,
      @Param("moneyType") List<PaymentTypeConstants> moneyType);

  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.isDelete = false "
      + "ORDER BY i.updatedAt DESC")
  List<Invoice> searchInvoiceWithoutSearchStringForExport(
      @Param("filter") List<InvoiceStatus> filter,
      @Param("moneyType") List<PaymentTypeConstants> moneyType);

  @Query("SELECT i FROM Invoice i "
      + "WHERE i.invoiceStatus IN :filter AND (:#{#moneyType == null or #moneyType.isEmpty()} = true OR i.paymentType IN :moneyType) "
      + "AND i.updatedAt BETWEEN :updatedAtFrom AND :updatedAtTo "
      + "AND i.isDelete = false "
      + "ORDER BY i.updatedAt DESC")
  List<Invoice> searchInvoiceWithoutSearchStringWithDatesForExport(
      @Param("filter") List<InvoiceStatus> filter, @Param("updatedAtFrom") Date updatedAtFrom,
      @Param("updatedAtTo") Date updatedAtTo,
      @Param("moneyType") List<PaymentTypeConstants> moneyType);


  @Query("SELECT COUNT(DISTINCT e.student.id) AS studentCount, "
      + "COALESCE(SUM(COALESCE(i.tuitionOwed, 0)) - SUM(COALESCE(i.amount, 0)) - SUM(COALESCE(i.invoiceDiscount, 0)), 0) AS totalTuitionOwed "
      + "FROM Invoice i JOIN i.enrollment e "
      + "WHERE i.invoiceStatus IN ('NOT_PAID', 'PARTIALLY_PAID') AND i.isDelete = false")
  UnpaidTuitionSummary getUnpaidTuitionSummary();

  @Query("SELECT COUNT(DISTINCT e.student.id) AS studentCount, "
      + "COALESCE(SUM(COALESCE(i.tuitionOwed, 0)) - SUM(COALESCE(i.amount, 0)) - SUM(COALESCE(i.invoiceDiscount, 0)), 0) AS totalTuitionOwed "
      + "FROM Invoice i JOIN i.enrollment e "
      + "WHERE i.invoiceStatus IN ('NOT_PAID', 'PARTIALLY_PAID') AND i.updatedAt BETWEEN :updatedFrom AND :updatedTo "
      + "AND i.isDelete = false")
  UnpaidTuitionSummary getUnpaidTuitionSummaryWithDate(@Param("updatedFrom") Date updatedFrom,
      @Param("updatedTo") Date updatedTo);

  @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Invoice i WHERE i.isDelete = false")
  Double getWeeklyRevenue();

  @Query("SELECT COALESCE(SUM(i.amount), 0) "
      + "FROM Invoice i WHERE i.updatedAt BETWEEN :updatedFrom AND :updatedTo AND i.isDelete = false")
  Double getWeeklyRevenueWithDate(@Param("updatedFrom") Date updatedFrom,
      @Param("updatedTo") Date updatedTo);

  @Modifying
  @Query("UPDATE Invoice i SET i.isDelete = true WHERE i.enrollment.student.id = :id")
  void deleteInvoiceMappingByStudent(@Param("id") int id);


  @Modifying
  @Query("UPDATE Invoice i SET i.isDelete = true WHERE i.enrollment.student.id IN (:id) AND i.enrollment.classTvms.id = :classId")
  void softDeleteInvoiceMappingByListStudent(@Param("id") List<Integer> id,
      @Param("classId") int classId);


  @Modifying
  @Query("UPDATE Invoice i SET i.isDelete = true WHERE i.enrollment.classTvms.id = :id")
  void deleteInvoiceMappingByClass(@Param("id") int id);

  @Query("SELECT i FROM Invoice i WHERE i.enrollment.student.id = :studentId AND i.invoiceStatus LIKE 'NOT_PAID'")
  Optional<Invoice> findInvoiceByStudentNotPaid(@Param("studentId") int studentId);

  @Query("SELECT i FROM Invoice i WHERE i.enrollment.classTvms.id = :classId and i.isDelete = false")
  List<Invoice> findAllByClassId(@Param("classId") int classId);
}
