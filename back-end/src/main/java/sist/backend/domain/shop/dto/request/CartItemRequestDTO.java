package sist.backend.domain.shop.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemRequestDTO {

    @JsonProperty("product_idx")
    @NotNull(message = "상품 ID는 필수 입력값입니다")
    private Long productIdx;

    @JsonProperty("quantity")
    @NotNull(message = "수량은 필수 입력값입니다")
    @Min(value = 1, message = "수량은 1 이상이어야 합니다")
    private Integer quantity;
}
