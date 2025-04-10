package sist.backend.domain.reservation.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class DiningReservationRequestDTO {

    private String restaurantName;
    private int numberOfAdults;     // 성인 인원 수
    private int numberOfChildren;   // 어린이 인원 수
    private LocalDateTime reservationTime;
    private String FirstName;
    private String LastName;
    private String customerPhone;
    private String customerEmail;
    private String specialRequest;

    // 클라이언트로부터 받은 예약 데이터를 서버에서 처리할 때 사용할 DTO입니다.
}
