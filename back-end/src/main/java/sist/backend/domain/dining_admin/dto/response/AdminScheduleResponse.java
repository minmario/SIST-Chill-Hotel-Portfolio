package sist.backend.domain.dining_admin.dto.response;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.dining_reservation.entity.DiningReservation;

@Getter
@Builder
public class AdminScheduleResponse {

    private Long restaurantId;
    private String reservationTime;
    private String guestName;
    private String firstName;
    private String lastName;
    private int partySize;
    private int adults;
    private int children;
    private String request;
    private String reservationNum;
    private String status;
    private String phone;
    private String email;
    private String reservationDate;

    public static AdminScheduleResponse from(DiningReservation r) {
        return AdminScheduleResponse.builder()
                .restaurantId(r.getRestaurantId())
                .reservationTime(r.getReservationTime().toString())
                .guestName(r.getLastName() + r.getFirstName())
                .firstName(r.getFirstName())
                .lastName(r.getLastName())
                .partySize(r.getAdults() + r.getChildren())
                .adults(r.getAdults())
                .children(r.getChildren())
                .request(r.getRequest())
                .reservationNum(r.getReservationNum())
                .status(r.getStatus() != null ? r.getStatus() : "PENDING")
                .phone(r.getPhone())
                .email(r.getEmail())
                .reservationDate(r.getReservationDate().toString())
                .build();
    }
}
