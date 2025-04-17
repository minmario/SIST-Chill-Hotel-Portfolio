package sist.backend.domain.reservation.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@Builder
public class AdminReservationResponse {

    private String reservationNum;

    private String fullName;
    private String phone;
    private String email;

    private String status;

    private LocalDate checkIn;
    private LocalDate checkOut;

    private int roomCount;
    private int adultCount;
    private int childCount;

    private String roomNumber;       // from Room.roomNum
    private String roomTypeIdx;     // from RoomType.roomName
    private String roomGrade;        // from RoomType.grade

    private int total;
    private String specialRequests;
}