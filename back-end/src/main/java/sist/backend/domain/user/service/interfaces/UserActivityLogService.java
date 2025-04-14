package sist.backend.domain.user.service.interfaces;

import java.time.LocalDateTime;
import java.util.List;

import sist.backend.domain.user.dto.response.UserActivityLogResponseDTO;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;

public interface UserActivityLogService {
    /**
     * 사용자 인덱스로 활동을 로깅합니다.
     */
    void logActivity(Long userIdx, ActivityType activityType, String activityDetails, String ipAddress);
    
    /**
     * 사용자 엔티티로 활동을 로깅합니다.
     */
    void logActivity(User user, ActivityType activityType, String activityDetails, String ipAddress);
    
    /**
     * 사용자 로그인 활동을 기록합니다.
     */
    void logLogin(User user, String ipAddress);
    
    /**
     * 사용자 로그아웃 활동을 기록합니다.
     */
    void logLogout(User user, String ipAddress);
    
    /**
     * 모든 활동 로그를 조회합니다.
     */
    List<UserActivityLogResponseDTO> getAllLogs();
    
    /**
     * 사용자별 활동 로그를 조회합니다.
     */
    List<UserActivityLogResponseDTO> getLogsByUser(Long userIdx);
    
    /**
     * 기간별 활동 로그를 조회합니다.
     */
    List<UserActivityLogResponseDTO> getLogsByDateRange(LocalDateTime start, LocalDateTime end);
    
    /**
     * 활동 유형별 로그를 조회합니다.
     */
    List<UserActivityLogResponseDTO> getLogsByActivityType(ActivityType activityType);
}
