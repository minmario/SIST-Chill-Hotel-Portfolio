package sist.backend.domain.shop.dto.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter @Builder
public class OrderResponse {
    private Long orderIdx;
    private String userName;
    private String orderStatus;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private List<OrderItemDto> items;

    @Getter @Builder
    public static class OrderItemDto {
        private String itemName;
        private int quantity;
        private BigDecimal price;
    }
}
