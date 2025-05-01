package sist.backend.domain.restaurant.service;

import java.time.LocalTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.restaurant.dto.response.RestaurantResponse;
import sist.backend.domain.restaurant.entity.Restaurant;
import sist.backend.domain.restaurant.repository.RestaurantRepository;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public Page<RestaurantResponse> getAllRestaurants(Pageable pageable) {
        return restaurantRepository.findAll(pageable) // ✅ Page<Restaurant>
                .map(this::toResponse); // ✅ Page.map()
    }

    public Optional<RestaurantResponse> getById(Long id) {
        return restaurantRepository.findById(id)
                .map(this::toResponse);
    }

    private RestaurantResponse toResponse(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getRestaurantsIdx())
                .name(restaurant.getName())
                .type(restaurant.getType())
                .description(restaurant.getDescription())
                .image(restaurant.getImage())
                .location(restaurant.getLocation())
                .capacity(restaurant.getCapacity())
                .breakfastOpen(formatTime(restaurant.getBreakfastOpen()))
                .breakfastClose(formatTime(restaurant.getBreakfastClose()))
                .lunchOpen(formatTime(restaurant.getLunchOpen()))
                .lunchClose(formatTime(restaurant.getLunchClose()))
                .dinnerOpen(formatTime(restaurant.getDinnerOpen()))
                .dinnerClose(formatTime(restaurant.getDinnerClose()))
                .price(RestaurantResponse.Price.builder()
                        .adult(restaurant.getPriceAdult())
                        .child(restaurant.getPriceChild())
                        .build())
                .build();
    }

    private static String formatTime(LocalTime time) {
        return time != null ? time.toString().substring(0, 5) : null;
    }

    public Page<RestaurantResponse> getRestaurantsWithSearch(String keyword, Pageable pageable) {
        return restaurantRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageable)
                .map(this::toResponse);
    }

}
