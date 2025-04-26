package sist.backend.domain.dining_reservation.dto.response;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.dining_reservation.entity.DiningReservation;

@Getter
@Builder
public class DiningReservationResponse {

    private String reservationNum;
    private Long restaurantId;
    private String restaurantName;
    private String reservationDate;
    private String mealTime;
    private String reservationTime;
    private int adults;
    private int children;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String request;
    private String status;

    public static DiningReservationResponse fromEntity(DiningReservation r) {
    return DiningReservationResponse.builder()
        .reservationNum(r.getReservationNum())
        .restaurantId(r.getRestaurantId())
        .restaurantName(r.getRestaurantName())
        .reservationDate(r.getReservationDate() != null ? r.getReservationDate().toString() : null)
        .reservationTime(r.getReservationTime() != null ? r.getReservationTime().toString() : null)
        .mealTime(r.getMealTime())
        .adults(r.getAdults())
        .children(r.getChildren())
        .firstName(r.getFirstName())
        .lastName(r.getLastName())
        .phone(r.getPhone())
        .email(r.getEmail())
        .request(r.getRequest())
        .status(r.getStatus() != null ? r.getStatus() : "PENDING") // 기본값 설정도 가능
        .build();
    }

}
