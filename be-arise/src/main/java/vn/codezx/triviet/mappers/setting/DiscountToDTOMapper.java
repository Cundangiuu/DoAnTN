package vn.codezx.triviet.mappers.setting;

import org.springframework.stereotype.Component;
import vn.codezx.triviet.dtos.discount.DiscountDTO;
import vn.codezx.triviet.entities.setting.Discount;
import vn.codezx.triviet.mappers.DtoMapper;

@Component
public class DiscountToDTOMapper extends DtoMapper<Discount, DiscountDTO> {

  @Override
  public DiscountDTO toDto(Discount entity) {
    return DiscountDTO.builder().id(entity.getId()).type(entity.getType())
        .amount(entity.getAmount()).description(entity.getDescription())
        .createdAt(entity.getCreatedAt()).description(entity.getDescription())
        .createdAt(entity.getCreatedAt()).createdBy(entity.getCreatedBy())
        .updatedAt(entity.getUpdatedAt()).updatedBy(entity.getUpdatedBy()).build();
  }
}
