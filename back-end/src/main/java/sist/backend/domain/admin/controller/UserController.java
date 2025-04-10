package sist.backend.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.response.TotalUserDailyChangeResponse;
import sist.backend.domain.admin.dto.response.UserDailyChangeResponse;
import sist.backend.domain.admin.dto.response.UserResponse;
import sist.backend.domain.admin.service.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 사용자 관련 API 컨트롤러
 * - 총 회원 수
 * - 최근 가입자
 * - 스태프 수
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** 전체 회원 수 반환 */
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalUsers() {
        return ResponseEntity.ok(userService.getTotalUserCount());
    }

    /** 최근 7일 이내 가입자 목록 반환 */
    @GetMapping("/recent")
    public ResponseEntity<List<UserResponse>> getRecentUsers() {
        return ResponseEntity.ok(userService.getRecentUsers());
    }

    /** staff 권한 회원 수 반환 */
    @GetMapping("/staff-count")
    public ResponseEntity<Long> getStaffCount() {
        return ResponseEntity.ok(userService.getStaffCount());
    }

    @GetMapping("/daily-change")
    public ResponseEntity<UserDailyChangeResponse> getDailyUserChange() {
        return ResponseEntity.ok(userService.getDailyUserChange());
    }

    @GetMapping("/daily-total-change")
    public ResponseEntity<TotalUserDailyChangeResponse> getDailyTotalUserChange() {
        return ResponseEntity.ok(userService.getDailyTotalUserChange());
    }

    @GetMapping("/daily-staff-change")
    public ResponseEntity<UserDailyChangeResponse> getDailyNewStaffChange() {
        return ResponseEntity.ok(userService.getDailyNewStaffChange());
    }

}
