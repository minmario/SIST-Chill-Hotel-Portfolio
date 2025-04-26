package sist.backend.domain.dining_reservation.service.interfaces;

import sist.backend.domain.dining_reservation.dto.request.DiningReservationRequest;
import sist.backend.domain.dining_reservation.dto.response.DiningReservationResponse;

public interface DiningReservationService {

    // 다이닝 예약 생성
    String reserve(DiningReservationRequest request);

    // 예약 번호로 다이닝 예약 조회
    DiningReservationResponse findByReservationNumber(String reservationNum);

    // 예약자 정보로 다이닝 예약 조회
    DiningReservationResponse findByGuestInfo(String lastName, String firstName, String phone);

    void cancelReservation(String reservationNum); // 예약 취소 메서드 추가
}
