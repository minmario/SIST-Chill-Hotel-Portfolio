package sist.backend.domain.admin.dto.request;

import lombok.*;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminGiftShopRequestDTO {
    private String itemName;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private String category;
}