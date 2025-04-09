package sist.backend.domain.shop.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequestDTO {
    private String deliveryAddress;
    private String recipientName;
    private String recipientPhone;
    private String orderMessage;
}