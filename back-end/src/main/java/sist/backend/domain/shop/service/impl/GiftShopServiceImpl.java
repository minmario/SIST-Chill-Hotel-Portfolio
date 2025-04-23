package sist.backend.domain.shop.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.dto.mapper.*;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;
import sist.backend.domain.shop.exception.custom.*;
import sist.backend.domain.shop.repository.jpa.*;
import sist.backend.domain.shop.repository.querydsl.*;
import sist.backend.domain.shop.service.interfaces.*;
import sist.backend.global.exception.NotFoundException;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GiftShopServiceImpl implements GiftShopService {

    private final GiftShopRepository giftShopRepository;
    private final GiftShopQueryRepository giftShopQueryRepository;
    private final GiftShopMapper giftShopMapper;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;

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
    public List<GiftShopResponseDTO> getAllProducts() {
        log.info("모든 상품 조회 서비스 호출");
        List<GiftShop> giftShops = giftShopRepository.findAll();
        log.info("상품 {} 개 조회됨", giftShops.size());
        for (GiftShop shop : giftShops) {
            log.debug("상품 정보: {}", shop);
        }
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    public GiftShopResponseDTO getProductById(Long itemIdx) {
        GiftShop giftShop = giftShopRepository.findById(itemIdx)
                .orElseThrow(() -> new NotFoundException("상품을 찾을 수 없습니다: " + itemIdx));
                
        return giftShopMapper.toDto(giftShop);
    }

    @Override
    public List<GiftShopResponseDTO> getProductsByCategory(String category) {
        log.info("카테고리별 상품 조회 서비스: {}", category);
        List<GiftShop> giftShops;
        
        // 카테고리 데이터 형식 확인 - 하이픈 또는 슬래시 형식 모두 처리
        String normalizedCategory = category;
        if (category.contains("/")) {
            normalizedCategory = category.replace("/", "-");
            log.info("슬래시를 하이픈으로 정규화: {}", normalizedCategory);
        }
        
        // SQL 스크립트에서는 하이픈(-) 형식으로 데이터가 저장되어 있음
        // 1. 정확한 카테고리 일치 검색 (서브카테고리가 있는 경우)
        giftShops = giftShopRepository.findByCategory(normalizedCategory);
        log.info("정확한 카테고리 검색 결과 ({}): {} 개", normalizedCategory, giftShops.size());
        
        // 2. 결과가 없으면 접두어 검색으로 시도 (메인 카테고리만 있는 경우)
        if (giftShops.isEmpty() && !normalizedCategory.contains("-")) {
            log.info("일치하는 카테고리가 없어 접두어 검색 수행: {}%", normalizedCategory);
            giftShops = giftShopRepository.findByCategoryStartingWith(normalizedCategory);
            log.info("접두어 검색 결과 ({}): {} 개", normalizedCategory, giftShops.size());
            
            // 3. 하이픈(-) 접두어 검색으로도 결과가 없으면, 하이픈을 추가하여 검색
            if (giftShops.isEmpty()) {
                String categoryWithHyphen = normalizedCategory + "-";
                log.info("하이픈 추가 검색 시도: {}", categoryWithHyphen);
                giftShops = giftShopRepository.findByCategoryStartingWith(categoryWithHyphen);
                log.info("하이픈 추가 검색 결과 ({}): {} 개", categoryWithHyphen, giftShops.size());
            }
        }
        
        log.info("최종 카테고리 {} 검색 결과: {} 개", category, giftShops.size());
        
        // 결과 없으면 디버깅을 위해 모든 카테고리 로깅
        if (giftShops.isEmpty()) {
            log.warn("카테고리 검색 결과 없음. 현재 DB에 저장된 카테고리 확인:");
            List<GiftShop> allItems = giftShopRepository.findAll();
            for (GiftShop item : allItems) {
                log.warn("DB 카테고리: {}, 상품명: {}", item.getCategory(), item.getItemName());
            }
        }
        
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    public List<GiftShopResponseDTO> searchProducts(String keyword) {
        List<GiftShop> giftShops = giftShopRepository.findByItemNameContaining(keyword);
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    public List<GiftShopResponseDTO> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        List<GiftShop> giftShops = giftShopQueryRepository.findByPriceRange(minPrice, maxPrice);
        return giftShopMapper.toDtoList(giftShops);
    }

    @Override
    @Transactional
    public GiftShopResponseDTO updateItem(Long itemIdx, GiftShopRequestDTO requestDto) {
        GiftShop existingGiftShop = giftShopRepository.findById(itemIdx)
                .orElseThrow(() -> new ResourceNotFoundException("상품을 찾을 수 없습니다: " + itemIdx));
        
        // 엔티티 업데이트 (기존 생성일자와 업데이트일자 유지)
        GiftShop updatedGiftShop = GiftShop.builder()
                .itemIdx(existingGiftShop.getItemIdx())
                .itemName(requestDto.getItemName())
                .description(requestDto.getDescription())
                .price(requestDto.getPrice())
                .stockQuantity(requestDto.getStockQuantity())
                .category(requestDto.getCategory())
                .imageUrl(requestDto.getImageUrl())
                .createdAt(existingGiftShop.getCreatedAt()) // 기존 생성일자 유지
                .updatedAt(java.time.LocalDateTime.now()) // 현재 시간으로 업데이트일자 설정
                .build();
        
        GiftShop savedGiftShop = giftShopRepository.save(updatedGiftShop);
        log.info("상품 {} 업데이트 완료, 이미지 URL: {}", itemIdx, requestDto.getImageUrl());
        return giftShopMapper.toDto(savedGiftShop);
    }

    @Override
    @Transactional
    public void deleteItem(Long itemIdx) {
        if (!giftShopRepository.existsById(itemIdx)) {
            throw new ResourceNotFoundException("상품을 찾을 수 없습니다: " + itemIdx);
        }
        
        try {
            // 주문 아이템에서 해당 상품을 참조하는지 확인
            List<OrderItem> orderItems = orderItemRepository.findByItemItemIdx(itemIdx);
            if (!orderItems.isEmpty()) {
                log.warn("상품 {}은(는) {} 개의 주문에서 사용 중이므로 삭제할 수 없습니다.", itemIdx, orderItems.size());
                throw new IllegalStateException("이 상품은 주문 내역에 포함되어 있어 삭제할 수 없습니다. 상품 ID: " + itemIdx);
            }
            
            // 해당 상품을 참조하는 장바구니 아이템을 먼저 삭제
            cartItemRepository.deleteByItemItemIdx(itemIdx);
            log.info("상품 {}와 연관된 장바구니 아이템 삭제 완료", itemIdx);
            
            // 상품 삭제
            giftShopRepository.deleteById(itemIdx);
            log.info("상품 {} 삭제 완료", itemIdx);
        } catch (IllegalStateException e) {
            // 주문에 포함된 상품 삭제 시도 시 발생하는 예외는 그대로 던짐
            throw e;
        } catch (Exception e) {
            log.error("상품 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("상품 삭제 중 오류가 발생했습니다: " + e.getMessage(), e);
        }
    }

    @Override
    public List<GiftShopResponseDTO> getLowStockItems(Integer threshold) {
        List<GiftShop> giftShops = giftShopQueryRepository.findByStockLessThan(threshold);
        return giftShopMapper.toDtoList(giftShops);
    }
}