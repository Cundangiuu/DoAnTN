package vn.codezx.arise.mappers.setting;

import org.springframework.stereotype.Component;
import vn.codezx.arise.dtos.discount.DiscountDTO;
import vn.codezx.arise.entities.setting.Discount;
import vn.codezx.arise.mappers.DtoMapper;

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
