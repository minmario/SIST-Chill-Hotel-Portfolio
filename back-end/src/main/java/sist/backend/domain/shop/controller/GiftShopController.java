package sist.backend.domain.shop.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.service.interfaces.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/gift-shop")
@RequiredArgsConstructor
public class GiftShopController {

    private final GiftShopService giftShopService;

    @PostMapping
    public ResponseEntity<GiftShopResponseDTO> createItem(@Valid @RequestBody GiftShopRequestDTO requestDto) {
        GiftShopResponseDTO responseDto = giftShopService.createItem(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/{itemIdx}")
    public ResponseEntity<GiftShopResponseDTO> getItemById(@PathVariable("itemIdx") Long itemIdx) {
        GiftShopResponseDTO responseDto = giftShopService.getItemById(itemIdx);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<GiftShopResponseDTO>> getAllProducts() {
        log.info("모든 상품 조회 요청");
        List<GiftShopResponseDTO> products = giftShopService.getAllProducts();
        log.info("전체 상품 {} 개 조회 완료", products.size());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GiftShopResponseDTO>> getProductsByCategory(
            @PathVariable("category") String category,
            @RequestParam(value = "sortBy", required = false) String sortBy,
            @RequestParam(value = "sortDirection", required = false) String sortDirection) {
        log.info("카테고리별 상품 조회 요청: category={}, sortBy={}, sortDirection={}", 
                category, sortBy, sortDirection);
        
        try {
            // 클라이언트에서 받은 카테고리 파라미터 로깅
            log.info("원본 카테고리 파라미터: '{}'", category);
            
            // URL 디코딩이 필요한지 확인
            if (category.contains("%")) {
                log.info("URL 인코딩된 문자 포함: {}", category);
            }
            
            // 결과 조회
            List<GiftShopResponseDTO> products = giftShopService.getProductsByCategory(category);
            log.info("카테고리 '{}' 상품 검색 결과: {} 개 조회 완료", category, products.size());
            
            // 결과가 없는 경우 SQL 데이터와 비교를 위한 로깅
            if (products.isEmpty()) {
                log.warn("카테고리 '{}' 검색 결과 없음. SQL 스크립트에 해당 카테고리가 있는지 확인 필요", category);
            } else {
                // 검색 결과의 첫 번째 카테고리 출력 (디버깅용)
                log.info("검색된 첫 번째 상품의 카테고리: '{}'", products.get(0).getCategory());
            }
            
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("카테고리 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<GiftShopResponseDTO>> getItemsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getItemsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<GiftShopResponseDTO>> searchProducts(@RequestParam String keyword) {
        List<GiftShopResponseDTO> products = giftShopService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{itemIdx}")
    public ResponseEntity<GiftShopResponseDTO> updateItem(
            @PathVariable Long itemIdx,
            @Valid @RequestBody GiftShopRequestDTO requestDto) {
        GiftShopResponseDTO responseDto = giftShopService.updateItem(itemIdx, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{itemIdx}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemIdx) {
        giftShopService.deleteItem(itemIdx);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<GiftShopResponseDTO>> getLowStockItems(@RequestParam(defaultValue = "10") Integer threshold) {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getLowStockItems(threshold);
        return ResponseEntity.ok(responseDtos);
    }
}