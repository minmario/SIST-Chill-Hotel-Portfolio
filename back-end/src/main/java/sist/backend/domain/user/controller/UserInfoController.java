package sist.backend.domain.user.controller;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import sist.backend.domain.user.dto.request.UserUpdateRequest;
import sist.backend.domain.user.dto.response.UserResponse;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;
import sist.backend.global.jwt.JwtProvider;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserInfoController {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final UserActivityLogService userActivityLogService;

    @GetMapping("/me")
    public ResponseEntity<?> getUserInfo(HttpServletRequest request) {
        String userId = jwtProvider.extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body("토큰 오류 또는 만료");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자 없음");
        }

        // ❌ 잘못된 버전:
        // return ResponseEntity.ok(new UserResponse(user));

        // ✅ 수정된 버전:
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @GetMapping("/checkout-info")
    public ResponseEntity<?> getCheckoutUserInfo(HttpServletRequest request) {
        String userId = jwtProvider.extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body("토큰 오류 또는 만료");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자 없음");
        }

        Map<String, String> userInfoMap = new HashMap<>();
        // 이름에서 공백 제거
        userInfoMap.put("name", user.getName().replaceAll("\\s+", ""));
        // 전화번호에서 '-' 제거
        userInfoMap.put("phone", user.getPhone().replaceAll("-", ""));
        // 이메일 추가
        userInfoMap.put("email", user.getEmail());

        return ResponseEntity.ok(userInfoMap);
    }

    @GetMapping("/find_user")
    public ResponseEntity<?> findUserByUserName(@RequestParam String userId) {
        User user = userRepository.findByIdIs(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자 없음");
        }
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PatchMapping("/update")
    public ResponseEntity<?> updateUserInfo(@RequestBody UserUpdateRequest request, HttpServletRequest httpRequest) {
        String userId = jwtProvider.extractUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).body("토큰 오류 또는 만료");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자 없음");
        }

        // 현재 비밀번호 검증
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPwd())) {
            return ResponseEntity.status(401).body("현재 비밀번호가 일치하지 않습니다.");
        }

        // 정보 수정
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEnglishFirstName(request.getEnglishFirstName());
        user.setEnglishLastName(request.getEnglishLastName());

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPwd(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);
        String ipAddress = httpRequest.getRemoteAddr();
        userActivityLogService.logActivity(user, ActivityType.PASSWORD_CHANGE, "사용자 정보 수정 완료", ipAddress);

        return ResponseEntity.ok(UserResponse.from(user));

    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<?> withdrawUser(HttpServletRequest request) {
        String userId = jwtProvider.extractUserId(request);
        if (userId == null) {
            return ResponseEntity.status(401).body("토큰 오류 또는 만료");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body("사용자 없음");
        }
        String ipAddress = request.getRemoteAddr();
        userActivityLogService.logActivity(user, ActivityType.ACCOUNT_DELETE, "회원 탈퇴 완료", ipAddress);

        // 상태를 INACTIVE로 바꿈 (soft delete)
        user.setStatus(UserStatus.INACTIVE);
        userRepository.save(user);

        // ✅ 저장 후 로그 남기기

        return ResponseEntity.ok("회원 탈퇴 완료");
    }

}