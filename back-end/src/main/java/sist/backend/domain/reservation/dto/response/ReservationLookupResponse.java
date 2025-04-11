package sist.backend.domain.reservation.dto.response;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import sist.backend.domain.reservation.entity.Reservation;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Getter
@Setter
@Builder
public class ReservationLookupResponse {

    private String reservationNum;     // 예약번호
    private String fullName;           // 성 + 이름 합친 이름
    private String phone;              // 연락처
    private String email;              // 이메일

    private String roomName;           // 객실 이름 (Room.roomName)
    private String roomGrade;          // 등급 (RoomType.grade)
    
    private LocalDate checkInDate;
    private LocalDate checkOutDate;

    private int adultCount;
    private int childCount;
    private int totalNights;           // 숙박일 수 (checkOut - checkIn)
    private int totalPrice;            // 결제 총액

    private String status;             // CONFIRMED, CANCELLED 등 예약 상태

}