// PointTransactionController.java
package sist.backend.domain.membership.controller;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.membership.dto.response.PointSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTierSummaryResponse;
import sist.backend.domain.membership.dto.response.PointTransactionResponse;
import sist.backend.domain.membership.service.interfaces.PointTransactionService;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import sist.backend.domain.user.entity.User;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/user/points")
@RequiredArgsConstructor
public class PointTransactionController {

    private final PointTransactionService pointService;

    @GetMapping
    public List<PointTransactionResponse> getHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @AuthenticationPrincipal(expression = "user") User user) {
        return pointService.getUserPointHistory(user.getUserIdx(), startDate, endDate);
    }

    @GetMapping("/summary")
    public PointSummaryResponse getSummary(@AuthenticationPrincipal(expression = "user") User user) {
        return pointService.getUserPointSummary(user.getUserIdx());
    }

    @GetMapping("/summary/tier")
    public PointTierSummaryResponse getTierSummary(@AuthenticationPrincipal(expression = "user") User user) {
        return pointService.getTierSummary(user.getUserIdx());
    }
}