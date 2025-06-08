package vn.codezx.triviet.dtos.invoice;

import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.constants.InvoiceStatus;
import vn.codezx.triviet.constants.PaymentTypeConstants;
import vn.codezx.triviet.entities.base.BaseInfo;
import vn.codezx.triviet.entities.setting.Discount;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class InVoiceDTO extends BaseInfo {
  private int id;
  private String studentNickName;
  private String studentPhoneNumber;
  private Discount discount;
  private String staffName;
  private String studentName;
  private String studentCode;
  private String classCode;
  private String className;
  private int invoiceAttempt;
  private float tuitionOwed;
  private float tuitionCourseOwed;
  private float amount;
  private float invoiceDiscount;
  private PaymentTypeConstants paymentType;
  private String description;
  private InvoiceStatus invoiceStatus;
  private Date startDate;
}
