package sist.backend.domain.admin.service.impl;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.entity.AdminActivityLog;
import sist.backend.domain.admin.repository.AdminActivityLogRepository;
import sist.backend.domain.admin.service.AdminActivityLogService;
import sist.backend.infrastructure.logging.ActivityType;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AdminActivityLogServiceImpl implements AdminActivityLogService {
    private final AdminActivityLogRepository adminActivityLogRepository;

    @Override
    @Transactional
    public void logActivity(String adminId, ActivityType activityType,
            String activityDetails, String ipAddress) {
        AdminActivityLog log = AdminActivityLog.builder()
                .adminId(adminId)
                .activityType(activityType)
                .activityDetails(activityDetails)
                .ipAddress(ipAddress)
                .createdAt(LocalDateTime.now())
                .build();
        adminActivityLogRepository.save(log);
    }
}
