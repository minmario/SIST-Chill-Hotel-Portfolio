package sist.backend.domain.reservation.controller;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.reservation.dto.request.ReservationRequestDTO;
import sist.backend.domain.reservation.dto.response.ReservationResponseDTO;
import sist.backend.domain.reservation.service.interfaces.ReservationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(@RequestBody ReservationRequestDTO requestDTO) {
        return ResponseEntity.ok(reservationService.createReservation(requestDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReservationResponseDTO> getReservation(@PathVariable("id") Long reservationIdx) {
        return ResponseEntity.ok(reservationService.getReservationById(reservationIdx));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReservationResponseDTO>> getReservationsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(reservationService.getReservationsByUser(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelReservation(@PathVariable("id") Long reservationIdx) {
        reservationService.cancelReservation(reservationIdx);
        return ResponseEntity.noContent().build();
    }
}
