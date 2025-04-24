package sist.backend.domain.dining_reservation.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class DiningReservationRequest {
    private Long restaurantId;
    private LocalDate reservationDate;
    private String mealTime; // "BREAKFAST", "LUNCH", "DINNER"
    private LocalTime reservationTime;
    private int adults;
    private int children;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String request;
}
