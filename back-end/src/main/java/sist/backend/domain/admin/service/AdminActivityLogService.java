package sist.backend.domain.admin.service;

import sist.backend.domain.admin.entity.AdminActivityLog;

public interface AdminActivityLogService {
    void logActivity(String adminId, sist.backend.infrastructure.logging.ActivityType activityType,
            String activityDetails, String ipAddress);
}
