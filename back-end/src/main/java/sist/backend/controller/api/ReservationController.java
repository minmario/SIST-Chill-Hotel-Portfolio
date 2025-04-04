package sist.backend.controller.api;

import sist.backend.dto.request.ReservationRequestDTO;
import sist.backend.dto.response.ReservationResponse;
import sist.backend.service.interfaces.ReservationService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> register(@RequestBody ReservationRequestDTO request) {
        ReservationResponse response = reservationService.createReservation(request);
        return ResponseEntity.ok(response);
    }
}