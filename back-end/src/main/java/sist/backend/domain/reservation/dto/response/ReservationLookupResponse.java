package sist.backend.domain.reservation.dto.response;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ReservationLookupResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String roomType;
    private int numberOfGuests;
    private int adults;
    private int price;
    private String status;
}