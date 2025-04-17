package sist.backend.domain.dining_reservation.controller;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.dining_reservation.dto.request.DiningReservationStatusUpdateRequest;
import sist.backend.domain.dining_reservation.dto.response.DiningReservationResponse;
import sist.backend.domain.dining_reservation.service.interfaces.DiningReservationService;

@RestController
@RequestMapping("/admin/dining/reservations")
@RequiredArgsConstructor
public class AdminDiningReservationController {

    private final DiningReservationService reservationService;

    // 날짜별 예약 조회
    @GetMapping
    public List<DiningReservationResponse> getReservationsByDate(@RequestParam String date) {
        return reservationService.getReservationsByDate(date);
    }

    @PostMapping("/{id}")
    public void updateReservationStatus(
            @PathVariable Long id,
            @RequestBody DiningReservationStatusUpdateRequest request) {
        reservationService.updateReservationStatus(id, request.getStatus());
    }

}
