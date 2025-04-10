package sist.backend.domain.shop.service.interfaces;

import java.math.BigDecimal;
import java.util.List;

import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;

public interface GiftShopService {
    
    /**
     * 모든 상품 조회
     */
    List<GiftShopResponseDTO> getAllProducts();
    
    /**
     * 상품 ID로 상품 조회
     */
    GiftShopResponseDTO getProductById(Long itemIdx);
    
    /**
     * 카테고리별 상품 조회
     */
    List<GiftShopResponseDTO> getProductsByCategory(String category);
    
    /**
     * 키워드로 상품 검색
     */
    List<GiftShopResponseDTO> searchProducts(String keyword);

    GiftShopResponseDTO createItem(GiftShopRequestDTO requestDto);
    GiftShopResponseDTO getItemById(Long itemIdx);
    List<GiftShopResponseDTO> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    GiftShopResponseDTO updateItem(Long itemIdx, GiftShopRequestDTO requestDto);
    void deleteItem(Long itemIdx);
    List<GiftShopResponseDTO> getLowStockItems(Integer threshold);
}
