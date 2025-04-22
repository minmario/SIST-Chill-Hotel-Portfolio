package sist.backend.domain.reservation.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sist.backend.domain.reservation.dto.response.StaySummaryResponse;
import sist.backend.domain.reservation.service.ReservationService;
import sist.backend.global.security.CustomUserDetails;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/stays")
public class UserStayController {

    private final ReservationService reservationService;

    @GetMapping("/summary")
    public ResponseEntity<StaySummaryResponse> getStaySummary(
            @AuthenticationPrincipal(expression = "user") CustomUserDetails userDetails) {
        StaySummaryResponse summary = reservationService.getUserStaySummary(userDetails.getUser().getUserIdx());
        return ResponseEntity.ok(summary);
    }
}