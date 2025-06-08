package vn.codezx.arise.entities.reporting;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import vn.codezx.arise.constants.InvoiceStatus;
import vn.codezx.arise.constants.PaymentTypeConstants;
import vn.codezx.arise.entities.base.BaseInfo;


@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "invoice")
public class Invoice extends BaseInfo {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private int id;

  @ManyToOne
  @JoinColumn(name = "enrollment_id", nullable = false)
  @JsonIgnore
  private Enrollment enrollment;

  @Column(name = "amount")
  private Float amount;

  @Column(name = "description")
  private String description;

  @Column(name = "tuition_owed")
  private Float tuitionOwed;

  @Column(name = "invoice_discount")
  private Float invoiceDiscount;

  @Enumerated(EnumType.STRING)
  @Column(name = "status")
  private InvoiceStatus invoiceStatus;

  @Enumerated(EnumType.STRING)
  @Column(name = "payment_type")
  private PaymentTypeConstants paymentType;
}
