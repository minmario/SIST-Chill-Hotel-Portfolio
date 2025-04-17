package sist.backend.domain.dining_reservation.dto.response;

import java.time.format.DateTimeFormatter;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.dining_reservation.entity.DiningReservation;

@Getter
@Builder
public class DiningReservationResponse {

    private Long id;
    private String reservationNum;
    private Long restaurantId;
    private String firstName;
    private String lastName;
    private String reservationDate;
    private String mealTime;
    private String reservationTime;
    private int adults;
    private int children;
    private String phone;
    private String email;
    private String request;
    private String status;
    private String createdAt;
    private String updatedAt;

    public static DiningReservationResponse fromEntity(DiningReservation entity) {
        return DiningReservationResponse.builder()
                .id(entity.getId())
                .reservationNum(entity.getReservationNum())
                .restaurantId(entity.getRestaurantId())
                .firstName(entity.getFirstName())
                .lastName(entity.getLastName())
                .reservationDate(entity.getReservationDate().toString())
                .mealTime(entity.getMealTime())
                .reservationTime(entity.getReservationTime().toString())
                // .reservationTime(entity.getReservationTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                .adults(entity.getAdults())
                .children(entity.getChildren())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .request(entity.getRequest())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt().toString())
                .updatedAt(entity.getUpdatedAt() != null ? entity.getUpdatedAt().toString() : null)
                .build();
    }
}
