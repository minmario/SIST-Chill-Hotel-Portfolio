package sist.backend.domain.dining_admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_admin.dto.request.StatusUpdateRequest;
import sist.backend.domain.dining_admin.service.AdminDiningService;
import sist.backend.domain.admin.service.AdminActivityLogService;
import sist.backend.infrastructure.logging.ActivityType;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/admin/dining")
@RequiredArgsConstructor
public class AdminDiningStatusController {

    private final AdminDiningService adminDiningService;
    private final AdminActivityLogService adminActivityLogService; // 추가!

    @PostMapping("/status")
    public ResponseEntity<Void> updateStatus(@RequestBody StatusUpdateRequest request, HttpServletRequest httpRequest) {
        adminDiningService.updateReservationStatus(request.getReservationNum(), request.getStatus());

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId = authentication.getName(); // 수정된 부분

        adminActivityLogService.logActivity(
            adminId,
            ActivityType.DINING_RESERVATION_UPDATE,
            "다이닝 예약 상태를 [" + request.getStatus() + "]로 변경",
            getClientIp(httpRequest)
        );

        return ResponseEntity.ok().build();
    }


    // 클라이언트 IP 가져오기
    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }
}
