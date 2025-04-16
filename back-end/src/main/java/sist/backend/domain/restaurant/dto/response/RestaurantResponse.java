package sist.backend.domain.restaurant.dto.response;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.restaurant.entity.Restaurant;

@Getter
@Builder
public class RestaurantResponse {
    private Long restaurantsIdx;
    private String name;
    private String type;
    private String description;
    private String image;
    private String location;
    private String breakfastOpen;
    private String breakfastClose;
    private String lunchOpen;
    private String lunchClose;
    private String dinnerOpen;
    private String dinnerClose;
    private String open;
    private String close;
    private Integer priceAdult;
    private Integer priceChild;
    private Integer capacity;

    public static RestaurantResponse fromEntity(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .restaurantsIdx(restaurant.getRestaurantsIdx())
                .name(restaurant.getName())
                .type(restaurant.getType())
                .description(restaurant.getDescription())
                .image(restaurant.getImage())
                .location(restaurant.getLocation())
                .breakfastOpen(timeToString(restaurant.getBreakfastOpen()))
                .breakfastClose(timeToString(restaurant.getBreakfastClose()))
                .lunchOpen(timeToString(restaurant.getLunchOpen()))
                .lunchClose(timeToString(restaurant.getLunchClose()))
                .dinnerOpen(timeToString(restaurant.getDinnerOpen()))
                .dinnerClose(timeToString(restaurant.getDinnerClose()))
                .open(timeToString(restaurant.getOpen()))
                .close(timeToString(restaurant.getClose()))
                .priceAdult(restaurant.getPriceAdult())
                .priceChild(restaurant.getPriceChild())
                .capacity(restaurant.getCapacity())
                .build();
    }

    private static String timeToString(java.time.LocalTime time) {
        return time != null ? time.toString() : null;
    }
}
