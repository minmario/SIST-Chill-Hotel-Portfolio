package sist.backend.domain.restaurant.dto.response;

import java.time.LocalTime;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RestaurantResponse {
    private Long id;
    private String name;
    private String location;
    private Integer capacity;

    private LocalTime breakfastOpen;
    private LocalTime breakfastClose;
    private LocalTime lunchOpen;
    private LocalTime lunchClose;
    private LocalTime dinnerOpen;
    private LocalTime dinnerClose;
}
