package vn.codezx.triviet.dtos.invoice;

import java.math.BigInteger;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import vn.codezx.triviet.entities.base.BaseInfo;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@SuperBuilder
@EqualsAndHashCode(callSuper = false)
public class InvoiceReportDTO extends BaseInfo {

  private Long studentOwed;
  private Double totalDebt;
  private Double weeklyRevenue;
}
