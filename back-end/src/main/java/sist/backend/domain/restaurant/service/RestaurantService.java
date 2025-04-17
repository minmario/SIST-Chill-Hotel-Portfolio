package sist.backend.domain.restaurant.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.restaurant.dto.response.RestaurantResponse;
import sist.backend.domain.restaurant.entity.Restaurant;
import sist.backend.domain.restaurant.repository.RestaurantRepository;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;

    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
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

    private static String formatTime(java.time.LocalTime time) {
        return time != null ? time.toString().substring(0, 5) : null;
    }
}
