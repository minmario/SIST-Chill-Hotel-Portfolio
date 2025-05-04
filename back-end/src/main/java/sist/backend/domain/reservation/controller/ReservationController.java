package sist.backend.domain.reservation.controller;

import sist.backend.domain.reservation.dto.request.ReservationRequest;
import sist.backend.domain.reservation.dto.response.ReservationResponse;
import sist.backend.domain.reservation.service.ReservationService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<List<ReservationResponse>> createReservation(@RequestBody ReservationRequest request) {
        System.out.println("[DEBUG] createReservation() called");
        List<ReservationResponse> responses = reservationService.saveReservation(request);
        return ResponseEntity.ok(responses);
    }

    // 1. 예약번호로 조회
    @GetMapping("/check-by-num")
    public ResponseEntity<List<ReservationResponse>> getReservationsByNumber(@RequestParam String reservationNum) {
        List<ReservationResponse> responses = reservationService.getReservationsByNumber(reservationNum);
        return ResponseEntity.ok(responses);
    }

    // 2. 예약자 정보(성+이름+번호)로 조회
    @GetMapping("/check/guest")
    public ResponseEntity<List<ReservationResponse>> getReservationsByGuest(
            @RequestParam String lastName,
            @RequestParam String firstName,
            @RequestParam String phone) {
        List<ReservationResponse> responses = reservationService.getReservationsByGuest(lastName, firstName, phone);
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/cancel/{reservationNum}")
    public ResponseEntity<Void> cancelReservation(@PathVariable String reservationNum) {
        reservationService.cancelReservation(reservationNum);
        return ResponseEntity.ok().build();

    }
}