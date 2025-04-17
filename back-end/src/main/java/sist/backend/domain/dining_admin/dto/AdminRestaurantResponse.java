package sist.backend.domain.dining_admin.dto;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.restaurant.entity.Restaurant;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.restaurant.entity.Restaurant;

@Getter
@Builder
public class AdminRestaurantResponse {
    private Long restaurantsIdx;
    private String name;
    private Integer capacity;
    private String location;

    private String breakfastOpen;
    private String breakfastClose;
    private String lunchOpen;
    private String lunchClose;
    private String dinnerOpen;
    private String dinnerClose;

    public static AdminRestaurantResponse fromEntity(Restaurant r) {
        return AdminRestaurantResponse.builder()
                .restaurantsIdx(r.getRestaurantsIdx())
                .name(r.getName())
                .capacity(r.getCapacity())
                .location(r.getLocation())
                .breakfastOpen(toTimeString(r.getBreakfastOpen()))
                .breakfastClose(toTimeString(r.getBreakfastClose()))
                .lunchOpen(toTimeString(r.getLunchOpen()))
                .lunchClose(toTimeString(r.getLunchClose()))
                .dinnerOpen(toTimeString(r.getDinnerOpen()))
                .dinnerClose(toTimeString(r.getDinnerClose()))
                .build();
    }

    private static String toTimeString(java.time.LocalTime time) {
        return time != null ? time.toString().substring(0, 5) : "";
    }
}

