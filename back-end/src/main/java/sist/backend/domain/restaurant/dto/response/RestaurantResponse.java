package sist.backend.domain.restaurant.dto.response;

import java.time.LocalTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RestaurantResponse {
    private Long id;
    private String name;
    private String description;
    private String type;
    private String location;
    private Integer capacity;
    private String image;
    private LocalTime breakfastOpen;
    private LocalTime breakfastClose;
    private LocalTime lunchOpen;
    private LocalTime lunchClose;
    private LocalTime dinnerOpen;
    private LocalTime dinnerClose;

    private Price price;

    @Getter
    @Builder
    public static class Price {
        private Integer adult;
        private Integer child;
    }
}
