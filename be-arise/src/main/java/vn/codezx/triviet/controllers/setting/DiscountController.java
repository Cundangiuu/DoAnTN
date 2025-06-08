package vn.codezx.triviet.controllers.setting;

import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.web.SortDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.codezx.triviet.dtos.discount.DiscountDTO;
import vn.codezx.triviet.dtos.discount.DiscountRequest;
import vn.codezx.triviet.services.DiscountService;

@RestController
@RequestMapping(value = "/api/settings/discounts", produces = MediaType.APPLICATION_JSON_VALUE)
public class DiscountController {

  private final DiscountService discountService;

  public DiscountController(DiscountService discountService) {
    this.discountService = discountService;
  }

  @PostMapping("/{request-id}")
  public ResponseEntity<DiscountDTO> createDiscount(@PathVariable("request-id") String requestId,
      @RequestBody DiscountRequest discountRequest) {
    return ResponseEntity.ok(discountService.createDiscount(requestId, discountRequest));
  }

  @GetMapping("/{request-id}")
  public ResponseEntity<Page<DiscountDTO>> getDiscounts(
      @PathVariable("request-id") String requestId, @SortDefault(sort = "createdAt",
          direction = Direction.DESC) @ParameterObject Pageable pageable) {
    return ResponseEntity.ok(discountService.getDiscounts(requestId, pageable));
  }

  @GetMapping("/{request-id}/{discount-id}")
  public ResponseEntity<DiscountDTO> getDiscount(@PathVariable("request-id") String requestId,
      @PathVariable("discount-id") Integer discountId) {
    return ResponseEntity.ok(discountService.getDiscount(requestId, discountId));
  }

  @PutMapping("/{request-id}/{discount-id}")
  public ResponseEntity<DiscountDTO> updateDiscount(@PathVariable("request-id") String requestId,
      @PathVariable("discount-id") Integer discountId,
      @RequestBody DiscountRequest discountRequest) {
    return ResponseEntity
        .ok(discountService.updateDiscount(requestId, discountId, discountRequest));
  }

  @DeleteMapping("/{request-id}/{discount-id}")
  public ResponseEntity<DiscountDTO> deleteDiscount(@PathVariable("request-id") String requestId,
      @PathVariable("discount-id") Integer discountId) {
    return ResponseEntity.ok(discountService.deleteDiscount(requestId, discountId));
  }
}
