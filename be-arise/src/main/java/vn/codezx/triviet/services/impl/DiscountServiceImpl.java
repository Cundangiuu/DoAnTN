package vn.codezx.triviet.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import vn.codezx.triviet.constants.MessageCode;
import vn.codezx.triviet.dtos.discount.DiscountDTO;
import vn.codezx.triviet.dtos.discount.DiscountRequest;
import vn.codezx.triviet.entities.setting.Discount;
import vn.codezx.triviet.exceptions.TveException;
import vn.codezx.triviet.mappers.setting.DiscountToDTOMapper;
import vn.codezx.triviet.repositories.DiscountRepository;
import vn.codezx.triviet.services.DiscountService;
import vn.codezx.triviet.utils.LogUtil;
import vn.codezx.triviet.utils.MessageUtil;

@Service
@Slf4j
public class DiscountServiceImpl implements DiscountService {

  private final DiscountRepository discountRepository;
  private final MessageUtil messageUtil;
  private final DiscountToDTOMapper discountToDTOMapper;

  @Autowired
  public DiscountServiceImpl(DiscountRepository discountRepository, MessageUtil messageUtil,
      DiscountToDTOMapper discountToDTOMapper) {
    this.discountRepository = discountRepository;
    this.messageUtil = messageUtil;
    this.discountToDTOMapper = discountToDTOMapper;
  }

  @Override
  @Transactional
  public DiscountDTO createDiscount(String requestId, DiscountRequest discountRequest) {
    Discount discount;

    discount = Discount.builder().type(discountRequest.getType())
        .amount(discountRequest.getAmount()).description(discountRequest.getDescription()).build();

    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_DIS_CREATE_SUCCESS)));
    discount = discountRepository.saveAndFlush(discount);

    return discountToDTOMapper.toDto(discount);
  }

  @Override
  @Transactional(readOnly = true)
  public Page<DiscountDTO> getDiscounts(String requestid, Pageable pageable) {
    return discountRepository.findAllByIsDeleteIsFalse(pageable).map(discountToDTOMapper::toDto);
  }

  @Override
  @Transactional(readOnly = true)
  public DiscountDTO getDiscount(String requestId, Integer discountId) {
    Discount discount = findDiscountById(discountId, requestId);

    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_DIS_GET_SUCCESS, discountId)));

    return discountToDTOMapper.toDto(discount);
  }

  @Override
  @Transactional
  public DiscountDTO updateDiscount(String requestId, Integer discountId,
      DiscountRequest discountRequest) {
    Discount discount = findDiscountById(discountId, requestId);

    if (discountRequest.getType() != null) {
      discount.setType(discountRequest.getType());
    }
    if (discountRequest.getDescription() != null) {
      discount.setDescription(discountRequest.getDescription());
    }

    if (discountRequest.getAmount() != null) {
      discount.setAmount(discountRequest.getAmount());
    }

    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_DIS_UPDATE_SUCCESS, discountId)));

    return discountToDTOMapper.toDto(discountRepository.save(discount));
  }

  private Discount findDiscountById(Integer discountId, String requestId) {
    return discountRepository.findByIdAndIsDeleteIsFalse(discountId).orElseThrow(() -> {
      log.error(LogUtil.buildFormatLog(requestId,
          messageUtil.getMessage(MessageCode.MESSAGE_DIS_NOT_FOUND, discountId)));
      return new TveException(MessageCode.MESSAGE_NOT_FOUND,
          messageUtil.getMessage(MessageCode.MESSAGE_DIS_NOT_FOUND, discountId));
    });
  }

  @Override
  @Transactional
  public DiscountDTO deleteDiscount(String requestId, Integer discountId) {
    Discount discount = findDiscountById(discountId, requestId);

    discount.setIsDelete(true);
    log.info(LogUtil.buildFormatLog(requestId,
        messageUtil.getMessage(MessageCode.MESSAGE_DIS_DELETE_SUCCESS, discountId)));
    discountRepository.save(discount);
    return discountToDTOMapper.toDto(discount);
  }
}
