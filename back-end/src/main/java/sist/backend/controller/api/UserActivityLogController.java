package sist.backend.controller.api;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.dto.response.UserActivityLogResponseDto;
import sist.backend.entity.enums.ActivityType;
import sist.backend.service.interfaces.UserActivityLogService;

@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
public class UserActivityLogController {

    private final UserActivityLogService userActivityLogService;

    @GetMapping("/user/{userIdx}")
    public ResponseEntity<List<UserActivityLogResponseDto>> getLogsByUser(@PathVariable Long userIdx) {
        List<UserActivityLogResponseDto> responseDtos = userActivityLogService.getLogsByUser(userIdx);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<UserActivityLogResponseDto>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<UserActivityLogResponseDto> responseDtos = userActivityLogService.getLogsByDateRange(start, end);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/activity-type/{activityType}")
    public ResponseEntity<List<UserActivityLogResponseDto>> getLogsByActivityType(@PathVariable ActivityType activityType) {
        List<UserActivityLogResponseDto> responseDtos = userActivityLogService.getLogsByActivityType(activityType);
        return ResponseEntity.ok(responseDtos);
    }
}
