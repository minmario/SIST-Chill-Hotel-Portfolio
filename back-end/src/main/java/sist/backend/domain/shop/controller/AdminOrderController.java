package sist.backend.domain.shop.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.request.OrderStatusUpdateRequest;
import sist.backend.domain.shop.dto.response.OrderResponse;
import sist.backend.domain.shop.service.impl.AdminGiftShopService;

@RestController
@RequestMapping("/api/admin/gift_shop/orders")
@RequiredArgsConstructor
public class AdminOrderController {
    private final AdminGiftShopService orderService;

    @GetMapping
    public List<OrderResponse> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PostMapping("/{orderIdx}/status")
    public void updateOrderStatus(
            @PathVariable Long orderIdx,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        orderService.updateOrderStatus(orderIdx, request.getStatus());
    }
}

