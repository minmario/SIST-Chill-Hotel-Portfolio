package sist.backend.domain.user.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.user.dto.response.UserActivityLogResponseDTO;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;



@Slf4j
@RestController
@RequestMapping("/api/user/activity/logs")
@RequiredArgsConstructor
public class UserActivityLogController {

    private final UserActivityLogService userActivityLogService;

    @GetMapping
    public ResponseEntity<List<UserActivityLogResponseDTO>> getAllLogs() {
        log.info("사용자 활동 로그 전체 조회 요청 수신됨");
        List<UserActivityLogResponseDTO> responseDtos = userActivityLogService.getAllLogs();
        log.info("사용자 활동 로그 {} 건 반환", responseDtos.size());
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/user/{userIdx}")
     public ResponseEntity<List<UserActivityLogResponseDTO>> getLogsByUser(@PathVariable Long userIdx) {
         log.info("사용자 ID {} 활동 로그 조회 요청 수신됨", userIdx);
         List<UserActivityLogResponseDTO> responseDtos = userActivityLogService.getLogsByUser(userIdx);
         log.info("사용자 활동 로그 {} 건 반환", responseDtos.size());
         return ResponseEntity.ok(responseDtos);
     }

    @GetMapping("/date-range")
    public ResponseEntity<List<UserActivityLogResponseDTO>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        log.info("날짜 범위 로그 조회 요청 수신됨: {} ~ {}", start, end);
        List<UserActivityLogResponseDTO> responseDtos = userActivityLogService.getLogsByDateRange(start, end);
        log.info("날짜 범위 활동 로그 {} 건 반환", responseDtos.size());
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/activity-type/{activityType}")
    public ResponseEntity<List<UserActivityLogResponseDTO>> getLogsByActivityType(@PathVariable ActivityType activityType) {
        log.info("활동 유형 {} 로그 조회 요청 수신됨", activityType);
        List<UserActivityLogResponseDTO> responseDtos = userActivityLogService.getLogsByActivityType(activityType);
        log.info("활동 유형 로그 {} 건 반환", responseDtos.size());
        return ResponseEntity.ok(responseDtos);
    }
}