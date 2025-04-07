package sist.backend.domain.user.service.interfaces;

import java.time.LocalDateTime;
import java.util.List;

import sist.backend.domain.user.dto.response.UserActivityLogResponseDTO;
import sist.backend.domain.user.entity.ActivityType;

public interface UserActivityLogService {
    void logActivity(Long userIdx, ActivityType activityType, String activityDetails, String ipAddress);
    List<UserActivityLogResponseDTO> getLogsByUser(Long userIdx);
    List<UserActivityLogResponseDTO> getLogsByDateRange(LocalDateTime start, LocalDateTime end);
    List<UserActivityLogResponseDTO> getLogsByActivityType(ActivityType activityType);
}
