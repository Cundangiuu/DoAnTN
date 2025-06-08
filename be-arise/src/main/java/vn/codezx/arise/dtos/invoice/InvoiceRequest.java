package vn.codezx.arise.dtos.invoice;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.codezx.arise.constants.PaymentTypeConstants;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InvoiceRequest {
  private int invoiceId;
  private float amount;
  private float invoiceDiscount;
  private String description;
  private PaymentTypeConstants paymentType;
}
