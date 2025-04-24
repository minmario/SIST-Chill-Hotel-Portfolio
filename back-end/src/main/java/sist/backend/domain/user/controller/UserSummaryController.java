package sist.backend.domain.user.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import sist.backend.domain.membership.service.impl.PointTransactionServiceImpl;
import sist.backend.global.security.CustomUserDetails;

@RestController
@RequestMapping("/api/user/summary")
@RequiredArgsConstructor
public class UserSummaryController {

    private final PointTransactionServiceImpl pointTransactionService;

    /**
     * 마이페이지 진입 시 호출되는 사용자 등급/포인트/숙박 갱신 API
     */
    @PostMapping("/update")
    public void updateUserSummary(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userIdx = userDetails.getUser().getUserIdx();
        pointTransactionService.recalculateAndUpdateUserSummary(userIdx);
    }
}