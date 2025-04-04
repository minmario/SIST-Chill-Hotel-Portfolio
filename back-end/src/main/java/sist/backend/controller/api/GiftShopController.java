package sist.backend.controller.api;

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
import sist.backend.dto.request.GiftShopRequestDTO;
import sist.backend.dto.response.GiftShopResponseDTO;
import sist.backend.service.interfaces.GiftShopService;

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
        System.out.println("entry.");
        GiftShopResponseDTO responseDto = giftShopService.getItemById(itemIdx);
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping
    public ResponseEntity<List<GiftShopResponseDTO>> getAllItems() {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getAllItems();
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<GiftShopResponseDTO>> getItemsByCategory(@PathVariable String category) {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getItemsByCategory(category);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<GiftShopResponseDTO>> getItemsByPriceRange(
            @RequestParam BigDecimal minPrice,
            @RequestParam BigDecimal maxPrice) {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getItemsByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/search")
    public ResponseEntity<List<GiftShopResponseDTO>> getItemsByKeyword(@RequestParam String keyword) {
        List<GiftShopResponseDTO> responseDtos = giftShopService.getItemsByKeyword(keyword);
        return ResponseEntity.ok(responseDtos);
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
