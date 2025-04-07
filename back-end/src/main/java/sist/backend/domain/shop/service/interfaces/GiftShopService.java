package sist.backend.domain.shop.service.interfaces;

import java.math.BigDecimal;
import java.util.List;

import sist.backend.domain.shop.dto.request.GiftShopRequestDTO;
import sist.backend.domain.shop.dto.response.GiftShopResponseDTO;

public interface GiftShopService {
    GiftShopResponseDTO createItem(GiftShopRequestDTO requestDto);
    GiftShopResponseDTO getItemById(Long itemIdx);
    List<GiftShopResponseDTO> getAllItems();
    List<GiftShopResponseDTO> getItemsByCategory(String category);
    List<GiftShopResponseDTO> getItemsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice);
    List<GiftShopResponseDTO> getItemsByKeyword(String keyword);
    GiftShopResponseDTO updateItem(Long itemIdx, GiftShopRequestDTO requestDto);
    void deleteItem(Long itemIdx);
    List<GiftShopResponseDTO> getLowStockItems(Integer threshold);
}
