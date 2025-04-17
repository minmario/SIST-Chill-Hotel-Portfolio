package sist.backend.domain.auth.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import sist.backend.domain.auth.dto.request.UserLoginRequest;
import sist.backend.domain.auth.dto.request.UserRegisterRequest;
import sist.backend.domain.auth.dto.response.UserLoginResponse;
import sist.backend.domain.auth.dto.response.UserRegisterResponse;
import sist.backend.domain.auth.service.service.UserAuthService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user/auth")
@RequiredArgsConstructor
public class UserAuthController {

    private final UserAuthService userAuthService;
    private final UserRepository userRepository;
    private final UserActivityLogService userActivityLogService;

    @PostMapping("/login")
    public ResponseEntity<UserLoginResponse> login(@RequestBody UserLoginRequest request) {
        UserLoginResponse response = userAuthService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<UserRegisterResponse> register(@RequestBody UserRegisterRequest request) {
        UserRegisterResponse response = userAuthService.register(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout() {
        // 현재 로그인한 사용자 정보 가져오기
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getName() != null) {
            // 사용자 이메일로 사용자 정보 찾기
            userRepository.findByEmail(auth.getName()).ifPresent(user -> {
                // 로그아웃 활동 로그 기록
                String ipAddress = getClientIp();
                userActivityLogService.logLogout(user, ipAddress);
            });
        }

        // 응답 반환
        Map<String, String> response = new HashMap<>();
        response.put("message", "로그아웃 되었습니다.");
        return ResponseEntity.ok(response);
    }

    // 클라이언트 IP 주소 가져오기
    private String getClientIp() {
        String ipAddress = "0.0.0.0"; // 기본값
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = getIpFromRequest(request);
            }
        } catch (Exception e) {
            // IP 주소를 가져오는 중 오류가 발생하면 기본값 사용
        }
        return ipAddress;
    }

    // 요청에서 실제 IP 주소 추출
    private String getIpFromRequest(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 쉼표로 구분된 여러 IP가 있을 경우 첫 번째 IP 사용
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip;
    }

}