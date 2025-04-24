package sist.backend.domain.dining_menu.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_menu.dto.response.DiningMenuResponse;
import sist.backend.domain.dining_menu.service.DiningMenuService;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class DiningMenuController {

    private final DiningMenuService diningMenuService;

    @GetMapping("/{restaurantId}/menus")
    public ResponseEntity<List<DiningMenuResponse>> getMenusByRestaurant(@PathVariable Long restaurantId) {
        List<DiningMenuResponse> menus = diningMenuService.getMenusByRestaurantId(restaurantId);
        return ResponseEntity.ok(menus);
    }
}
