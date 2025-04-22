package sist.backend.domain.shop.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GiftShopRequestDTO {

    @NotBlank(message = "상품명은 필수 입력값입니다")
    private String itemName;

    private String description;

    @NotNull(message = "가격은 필수 입력값입니다")
    @Min(value = 0, message = "가격은 0 이상이어야 합니다")
    private BigDecimal price;

    @NotNull(message = "재고 수량은 필수 입력값입니다")
    @Min(value = 0, message = "재고 수량은 0 이상이어야 합니다")
    private Integer stockQuantity;

    private String category;
    
    private String imageUrl;
}
