package sist.backend.domain.restaurant.dto.response;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.restaurant.entity.Restaurant;

@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL) // 추가한 부분
public class RestaurantResponse {
    private Long id;
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

    private Price price; // price 객체 포함

    @Getter
    @Builder
    public static class Price {
        private Integer adult;
        private Integer child;
    }

    public static RestaurantResponse fromEntity(Restaurant restaurant) {
        return RestaurantResponse.builder()
                .id(restaurant.getRestaurantsIdx())
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
                .price(Price.builder()
                        .adult(restaurant.getPriceAdult())
                        .child(restaurant.getPriceChild())
                        .build())
                .build();
    }

    private static String timeToString(LocalTime time) {
        return time != null ? time.toString() : null;
    }
}
