package sist.backend.domain.user.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
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



@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
public class UserActivityLogController {

    private final UserActivityLogService userActivityLogService;


    @GetMapping("/user/{userIdx}")
     public ResponseEntity<List<UserActivityLogResponseDTO>> getLogsByUser(@PathVariable Long userIdx) {
         List<UserActivityLogResponseDTO> responseDtos = userActivityLogService.getLogsByUser(userIdx);
         return ResponseEntity.ok(responseDtos);
     }

    @GetMapping("/date-range")
    public ResponseEntity<List<UserActivityLogResponseDTO>> getLogsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<UserActivityLogResponseDTO> responseDtos = userActivityLogService.getLogsByDateRange(start, end);
        return ResponseEntity.ok(responseDtos);
    }

    @GetMapping("/activity-type/{activityType}")
    public ResponseEntity<List<UserActivityLogResponseDTO>> getLogsByActivityType(@PathVariable ActivityType activityType) {
        List<UserActivityLogResponseDTO> responseDtos = userActivityLogService.getLogsByActivityType(activityType);
        return ResponseEntity.ok(responseDtos);
    }
}