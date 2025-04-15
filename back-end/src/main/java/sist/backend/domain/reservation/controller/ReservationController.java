package sist.backend.domain.reservation.controller;

import sist.backend.domain.reservation.dto.request.ReservationRequest;
import sist.backend.domain.reservation.dto.response.ReservationLookupResponse;
import sist.backend.domain.reservation.dto.response.ReservationResponse;
import sist.backend.domain.reservation.service.ReservationService;


import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Long> createReservation(@RequestBody ReservationRequest request) {
        Long reservationId = reservationService.saveReservation(request);
        return ResponseEntity.ok(reservationId);
    }
   // 1. 예약번호로 조회
    @GetMapping("/check-by-num")
public ResponseEntity<ReservationLookupResponse> getReservationByNumber(@RequestParam String reservationNum) {
    return ResponseEntity.ok(reservationService.getReservationByNumber(reservationNum)); // ✅ DTO만 리턴
}

    // 2. 예약자 정보(성+이름+번호)로 조회
    @GetMapping("/check/guest")
    public ResponseEntity<ReservationLookupResponse> getReservationByGuest(
            @RequestParam String lastName,
            @RequestParam String firstName,
            @RequestParam String phone
    ) {
        return ResponseEntity.ok(
            reservationService.getReservationByGuest(lastName, firstName, phone)
        );
    }

    @PostMapping("/cancel/{reservationNum}")
public ResponseEntity<Void> cancelReservation(@PathVariable String reservationNum) {
    reservationService.cancelReservation(reservationNum);
    return ResponseEntity.ok().build();

    }
}