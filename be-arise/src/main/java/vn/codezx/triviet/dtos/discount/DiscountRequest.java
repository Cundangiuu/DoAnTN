package vn.codezx.triviet.dtos.discount;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DiscountRequest {
  private String type;
  private String description;
  private Float amount;
}
