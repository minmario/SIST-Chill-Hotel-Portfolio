package sist.backend.domain.dining_reservation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_reservation.dto.request.DiningReservationRequest;
import sist.backend.domain.dining_reservation.dto.response.DiningReservationResponse;
import sist.backend.domain.dining_reservation.service.interfaces.DiningReservationService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dining")
@RequiredArgsConstructor
public class DiningReservationController {

    private final DiningReservationService reservationService;

    // ✅ 예약 생성
    @PostMapping("/reservations")
    public ResponseEntity<Map<String, String>> createReservation(@RequestBody DiningReservationRequest request) {
        String reservationNum = reservationService.reserve(request);
        Map<String, String> result = new HashMap<>();
        result.put("reservationNum", reservationNum);
        return ResponseEntity.ok(result);
    }

    // ✅ 예약 번호 조회
    @GetMapping("/check-by-num")
    public ResponseEntity<DiningReservationResponse> checkByReservationNumber(@RequestParam String reservationNum) {
        DiningReservationResponse response = reservationService.findByReservationNumber(reservationNum);
        return ResponseEntity.ok(response);
    }

    // ✅ 예약자 정보 조회
    @GetMapping("/check/guest")
    public ResponseEntity<DiningReservationResponse> checkByGuestInfo(
            @RequestParam String lastName,
            @RequestParam String firstName,
            @RequestParam String phone
    ) {
        DiningReservationResponse response = reservationService.findByGuestInfo(lastName, firstName, phone);
        return ResponseEntity.ok(response);
    }

     // ✅ 예약 취소 추가
     @PostMapping("/cancel")
     public ResponseEntity<String> cancelReservation(@RequestParam String reservationNum) {
         try {
             reservationService.cancelReservation(reservationNum);
             return ResponseEntity.ok("예약이 성공적으로 취소되었습니다.");
         } catch (IllegalStateException e) {
             return ResponseEntity.badRequest().body(e.getMessage()); // 이미 취소된 경우
         }
     }
     
}
