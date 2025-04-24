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

    /************* ✨ Windsurf Command ⭐ *************/
    /**
     * 마이페이지 진입 시 호출되는 사용자 숙박 정보(숙박 수, 다음 등급까지의 숙박 수) API
     * 
     * @param userDetails CustomUserDetails
     * @return ResponseEntity<StaySummaryResponse>
     */
    /******* c1892f0d-403f-4e1c-88a6-324b1850a593 *******/
    @GetMapping("/summary")
    public ResponseEntity<StaySummaryResponse> getStaySummary(
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (userDetails == null || userDetails.getUser() == null) {
            return ResponseEntity.status(401).build(); // 인증 실패 처리
        }

        Long userIdx = userDetails.getUser().getUserIdx();
        StaySummaryResponse summary = reservationService.getUserStaySummary(userIdx);
        return ResponseEntity.ok(summary);
    }
}