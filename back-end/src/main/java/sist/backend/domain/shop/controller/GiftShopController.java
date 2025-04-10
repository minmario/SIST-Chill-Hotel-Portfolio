package sist.backend.domain.shop.controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.dto.request.*;
import sist.backend.domain.shop.dto.response.*;
import sist.backend.domain.shop.service.interfaces.*;

@Slf4j
@RestController
@RequestMapping("/api/v1/gift-shop")
@RequiredArgsConstructor
public class GiftShopController {

    private final GiftShopService giftShopService;

    @PostMapping
    public ResponseEntity<GiftShopResponseDTO> createItem(@Valid @RequestBody GiftShopRequestDTO requestDto) {
        GiftShopResponseDTO responseDto = giftShopService.createItem(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @GetMapping("/{itemIdx}")
    public ResponseEntity<GiftShopResponseDTO> getItemById(@PathVariable Long itemIdx) {
        GiftShopResponseDTO responseDto = giftShopService.getItemById(itemIdx);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<GiftShopResponseDTO>> getAllProducts() {
        List<GiftShopResponseDTO> products = giftShopService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GiftShopResponseDTO>> getProductsByCategory(@PathVariable String category) {
        List<GiftShopResponseDTO> products = giftShopService.getProductsByCategory(category);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<GiftShopResponseDTO>> getItemsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getItemsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<GiftShopResponseDTO>> searchProducts(@RequestParam String keyword) {
        List<GiftShopResponseDTO> products = giftShopService.searchProducts(keyword);
        return ResponseEntity.ok(products);
    }

    @PutMapping("/{itemIdx}")
    public ResponseEntity<GiftShopResponseDTO> updateItem(
            @PathVariable Long itemIdx,
            @Valid @RequestBody GiftShopRequestDTO requestDto) {
        GiftShopResponseDTO responseDto = giftShopService.updateItem(itemIdx, requestDto);
        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{itemIdx}")
    public ResponseEntity<Void> deleteItem(@PathVariable Long itemIdx) {
        giftShopService.deleteItem(itemIdx);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<GiftShopResponseDTO>> getLowStockItems(@RequestParam(defaultValue = "10") Integer threshold) {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getLowStockItems(threshold);
        return ResponseEntity.ok(responseDtos);
    }
}