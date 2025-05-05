package sist.backend.domain.restaurant.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import sist.backend.domain.restaurant.dto.response.RestaurantResponse;
import sist.backend.domain.restaurant.service.RestaurantService;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RestaurantController {

    private final RestaurantService restaurantService;

    // ✅ 검색 및 페이징 통합 메서드 (단 하나만 존재해야 함)
    @GetMapping
    public ResponseEntity<Page<RestaurantResponse>> getAllRestaurants(
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return ResponseEntity.ok(restaurantService.getAllRestaurants(pageable));
        } else {
            return ResponseEntity.ok(restaurantService.getRestaurantsWithSearch(keyword, pageable));
        }
    }

    // ✅ 개별 조회 (ID 기준)
    @GetMapping("/{id}")
    public ResponseEntity<RestaurantResponse> getById(@PathVariable("id") Long id) {
        return restaurantService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
