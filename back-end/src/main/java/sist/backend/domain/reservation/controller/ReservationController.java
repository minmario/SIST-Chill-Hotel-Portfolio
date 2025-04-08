package sist.backend.domain.reservation.controller;

import sist.backend.domain.reservation.dto.request.ReservationRequest;
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
    public ResponseEntity<ReservationResponse> register(@RequestBody ReservationRequest request) {
        ReservationResponse response = reservationService.createReservation(request);
        return ResponseEntity.ok(response);
    }
    @GetMapping("/check")
    public ResponseEntity<ReservationResponse> getReservation(
            @RequestParam Long userIdx,
            @RequestParam String reservationNum
    ) {
        return ResponseEntity.ok(reservationService.getReservation(userIdx, reservationNum));
    }
}