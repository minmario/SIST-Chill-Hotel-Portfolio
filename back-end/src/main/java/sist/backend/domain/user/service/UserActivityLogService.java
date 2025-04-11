package sist.backend.domain.user.service;

import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;

public interface UserActivityLogService {
    /**
     * 사용자 활동을 로깅합니다.
     * 
     * @param user 사용자 엔티티
     * @param activityType 활동 유형 (LOGIN, LOGOUT 등)
     * @param activityDetails 활동 상세 내용 (선택적)
     * @param ipAddress 사용자 IP 주소 (선택적)
     */
    void logActivity(User user, ActivityType activityType, String activityDetails, String ipAddress);
    
    /**
     * 간단한 로그인 활동을 기록합니다.
     * 
     * @param user 사용자 엔티티
     * @param ipAddress 사용자 IP 주소
     */
    void logLogin(User user, String ipAddress);
    
    /**
     * 간단한 로그아웃 활동을 기록합니다.
     * 
     * @param user 사용자 엔티티
     * @param ipAddress 사용자 IP 주소
     */
    void logLogout(User user, String ipAddress);
} 