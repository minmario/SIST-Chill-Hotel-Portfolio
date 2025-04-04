package sist.backend.dto.mapper;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import sist.backend.dto.request.GiftShopRequestDTO;
import sist.backend.dto.response.GiftShopResponseDTO;
import sist.backend.entity.GiftShop;

@Component
public class GiftShopMapper {

    public GiftShop toEntity(GiftShopRequestDTO dto) {
        return GiftShop.builder()
                .itemName(dto.getItemName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .stockQuantity(dto.getStockQuantity())
                .category(dto.getCategory())
                .build();
    }

    public GiftShopResponseDTO toDto(GiftShop entity) {
        return GiftShopResponseDTO.builder()
                .itemIdx(entity.getItemIdx())
                .itemName(entity.getItemName())
                .description(entity.getDescription())
                .price(entity.getPrice())
                .stockQuantity(entity.getStockQuantity())
                .category(entity.getCategory())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public List<GiftShopResponseDTO> toDtoList(List<GiftShop> entities) {
        return entities.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}