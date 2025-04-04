package sist.backend.service.interfaces;

import java.time.LocalDateTime;
import java.util.List;

import sist.backend.dto.response.UserActivityLogResponseDto;
import sist.backend.entity.enums.ActivityType;

public interface UserActivityLogService {
    void logActivity(Long userIdx, ActivityType activityType, String activityDetails, String ipAddress);
    List<UserActivityLogResponseDto> getLogsByUser(Long userIdx);
    List<UserActivityLogResponseDto> getLogsByDateRange(LocalDateTime start, LocalDateTime end);
    List<UserActivityLogResponseDto> getLogsByActivityType(ActivityType activityType);
}
