package sist.backend.domain.shop.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.mapper.GiftShopMapper;
import sist.backend.domain.shop.dto.request.GiftShopRequestDTO;
import sist.backend.domain.shop.dto.response.GiftShopResponseDTO;
import sist.backend.domain.shop.entity.GiftShop;
import sist.backend.domain.shop.exception.custom.ResourceNotFoundException;
import sist.backend.domain.shop.repository.jpa.GiftShopRepository;
import sist.backend.domain.shop.repository.querydsl.GiftShopQueryRepository;
import sist.backend.domain.shop.service.interfaces.GiftShopService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GiftShopServiceImpl implements GiftShopService {

    private final GiftShopRepository giftShopRepository;
    private final GiftShopQueryRepository giftShopQueryRepository;
    private final GiftShopMapper giftShopMapper;

    @Override
    @Transactional
    public GiftShopResponseDTO createItem(GiftShopRequestDTO requestDto) {
        GiftShop giftShop = giftShopMapper.toEntity(requestDto);
        GiftShop savedGiftShop = giftShopRepository.save(giftShop);
        return giftShopMapper.toDto(savedGiftShop);
    }

    @Override
    public GiftShopResponseDTO getItemById(Long itemIdx) {
        GiftShop giftShop = giftShopRepository.findById(itemIdx)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다: " + itemIdx));
        return giftShopMapper.toDto(giftShop);
    }

    @Override
    public List<GiftShopResponseDTO> getAllItems() {
        List<GiftShop> giftShops = giftShopRepository.findAll();
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    public List<GiftShopResponseDTO> getItemsByCategory(String category) {
        List<GiftShop> giftShops = giftShopRepository.findByCategory(category);
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    public List<GiftShopResponseDTO> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<GiftShop> giftShops = giftShopQueryRepository.findByPriceRange(minPrice, maxPrice);
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    public List<GiftShopResponseDTO> getItemsByKeyword(String keyword) {
        List<GiftShop> giftShops = giftShopRepository.findByItemNameContaining(keyword);
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    @Transactional
    public GiftShopResponseDTO updateItem(Long itemIdx, GiftShopRequestDTO requestDto) {
        GiftShop giftShop = giftShopRepository.findById(itemIdx)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다: " + itemIdx));
        
        // 엔티티 업데이트
        giftShop = GiftShop.builder()
                .itemIdx(giftShop.getItemIdx())
                .itemName(requestDto.getItemName())
                .description(requestDto.getDescription())
                .price(requestDto.getPrice())
                .stockQuantity(requestDto.getStockQuantity())
                .category(requestDto.getCategory())
                .build();
        
        GiftShop updatedGiftShop = giftShopRepository.save(giftShop);
        return giftShopMapper.toDto(updatedGiftShop);
    }

    @Override
    @Transactional
    public void deleteItem(Long itemIdx) {
        if (!giftShopRepository.existsById(itemIdx)) {
            throw new ResourceNotFoundException("상품을 찾을 수 없습니다: " + itemIdx);
        }
        giftShopRepository.deleteById(itemIdx);
    }

    @Override
    public List<GiftShopResponseDTO> getLowStockItems(Integer threshold) {
        List<GiftShop> giftShops = giftShopQueryRepository.findByStockLessThan(threshold);
        return giftShopMapper.toDtoList(giftShops);
    }
}