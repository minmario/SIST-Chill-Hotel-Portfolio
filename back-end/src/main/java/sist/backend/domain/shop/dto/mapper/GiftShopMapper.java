package sist.backend.domain.shop.dto.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;

@Component
public class GiftShopMapper {

    public GiftShop toEntity(GiftShopRequestDTO dto) {
        return GiftShop.builder()
                .itemName(dto.getItemName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .build();
    }

    public GiftShopResponseDTO toDto(GiftShop giftShop) {
        if (giftShop == null) {
            return null;
        }
        
        return GiftShopResponseDTO.builder()
                .itemIdx(giftShop.getItemIdx())
                .itemName(giftShop.getItemName())
                .description(giftShop.getDescription())
                .price(giftShop.getPrice())
                .stockQuantity(giftShop.getStockQuantity())
                .category(giftShop.getCategory())
                .imageUrl(giftShop.getImageUrl())
                .createdAt(giftShop.getCreatedAt())
                .updatedAt(giftShop.getUpdatedAt())
                .build();
    }

    public List<GiftShopResponseDTO> toDtoList(List<GiftShop> giftShops) {
        return giftShops.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}

