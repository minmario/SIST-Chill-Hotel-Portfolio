package sist.backend.domain.shop.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.entity.*;
import sist.backend.domain.shop.service.interfaces.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO requestDto) {
        OrderResponseDTO responseDto = orderService.createOrder(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/{orderIdx}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long orderIdx) {
        OrderResponseDTO responseDto = orderService.getOrderById(orderIdx);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/user/{userIdx}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByUser(@PathVariable Long userIdx) {
        List<OrderResponseDTO> responseDtos = orderService.getOrdersByUser(userIdx);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(@PathVariable OrderStatus status) {
        List<OrderResponseDTO> responseDtos = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<OrderResponseDTO> responseDtos = orderService.getOrdersByDateRange(start, end);
        return ResponseEntity.ok(responseDtos);
    }

    @PutMapping("/{orderIdx}/status")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long orderIdx,
            @RequestParam OrderStatus status) {
        OrderResponseDTO responseDto = orderService.updateOrderStatus(orderIdx, status);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/top-selling")
    public ResponseEntity<List<OrderResponseDTO>> getTopSellingItems(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end,
            @RequestParam(defaultValue = "10") int limit) {
        List<OrderResponseDTO> responseDtos = orderService.getTopSellingItems(start, end, limit);
        return ResponseEntity.ok(responseDtos);
    }
}
