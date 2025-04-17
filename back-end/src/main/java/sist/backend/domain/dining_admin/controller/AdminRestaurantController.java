package sist.backend.domain.dining_admin.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.dining_admin.dto.AdminRestaurantResponse;
import sist.backend.domain.restaurant.repository.RestaurantRepository;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminRestaurantController {

    private final RestaurantRepository restaurantRepository;

    @GetMapping("/restaurants")
    public List<AdminRestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(AdminRestaurantResponse::fromEntity)
                .toList();
    }
}