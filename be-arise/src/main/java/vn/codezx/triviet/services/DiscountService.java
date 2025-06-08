package vn.codezx.triviet.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import vn.codezx.triviet.dtos.discount.DiscountDTO;
import vn.codezx.triviet.dtos.discount.DiscountRequest;

public interface DiscountService {
  DiscountDTO createDiscount(String requestId, DiscountRequest discountRequest);

  Page<DiscountDTO> getDiscounts(String requestId, Pageable pageable);

  DiscountDTO getDiscount(String requestId, Integer discountId);

  DiscountDTO updateDiscount(String requestId, Integer discountId, DiscountRequest discountRequest);

  DiscountDTO deleteDiscount(String requestId, Integer discountId);
}
