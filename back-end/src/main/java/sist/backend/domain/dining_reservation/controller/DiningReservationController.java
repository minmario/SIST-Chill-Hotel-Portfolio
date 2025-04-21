package sist.backend.domain.dining_reservation.controller;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_reservation.dto.request.DiningReservationRequest;
import sist.backend.domain.dining_reservation.service.interfaces.DiningReservationService;

@RestController
@RequestMapping("/api/dining/reservations")
@RequiredArgsConstructor
public class DiningReservationController {

    private final DiningReservationService reservationService;

    @PostMapping
    public ResponseEntity<Map<String, String>> createReservation(@RequestBody DiningReservationRequest request) {
    String reservationNum = reservationService.reserve(request);
    Map<String, String> result = new HashMap<>();
    result.put("reservationNum", reservationNum);
    return ResponseEntity.ok(result);
}
}
