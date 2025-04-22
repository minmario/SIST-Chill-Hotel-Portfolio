package sist.backend.domain.reservation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import sist.backend.domain.reservation.dto.request.ReservationStatusUpdateRequest;
import sist.backend.domain.reservation.dto.response.AdminReservationResponse;
import sist.backend.domain.reservation.service.Impl.AdminReservationServiceImpl;

import java.util.List;

@RestController
@RequestMapping("/api/admin/reservations")
@RequiredArgsConstructor
public class AdminReservationController {

    private final AdminReservationServiceImpl reservationService;

    @GetMapping
    public ResponseEntity<List<AdminReservationResponse>> getAllReservations() {
        List<AdminReservationResponse> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    @GetMapping("/{reservationNum}")
    public ResponseEntity<AdminReservationResponse> getReservationDetail(@PathVariable String reservationNum) {
        AdminReservationResponse response = reservationService.getReservationDetail(reservationNum);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{reservationNum}/status")
    public ResponseEntity<Void> updateReservationStatus(
            @PathVariable String reservationNum,
            @RequestBody ReservationStatusUpdateRequest request) {
        System.out.println("pacth호출됨");
        reservationService.updateReservationStatus(reservationNum, request.getStatus());
        return ResponseEntity.ok().build();
    }
}