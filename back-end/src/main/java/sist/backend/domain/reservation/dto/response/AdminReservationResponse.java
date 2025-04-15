package sist.backend.domain.reservation.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class AdminReservationResponse {

    private String reservationNum;

    private String fullName;         // firstName + lastName 조합

    private String phone;

    private String email;

    private String status;

    private LocalDate checkIn;
    private LocalDate checkOut;

    private int roomCount;
    private int adultCount;
    private int childCount;

    private String roomNumber;
    private String roomType;

    private int total;

    private String specialRequests;
}