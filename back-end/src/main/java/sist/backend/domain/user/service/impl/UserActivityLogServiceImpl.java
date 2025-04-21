package sist.backend.domain.user.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.shop.exception.custom.ResourceNotFoundException;
import sist.backend.domain.user.dto.response.UserActivityLogResponseDTO;
import sist.backend.domain.user.entity.ActivityType;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserActivityLog;
import sist.backend.domain.user.repository.UserActivityLogRepository;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserActivityLogServiceImpl implements UserActivityLogService {

    private final UserActivityLogRepository userActivityLogRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public void logActivity(Long userIdx, ActivityType activityType, String activityDetails, String ipAddress) {
        User user = userRepository.findById(userIdx)
                .orElseThrow(() -> new ResourceNotFoundException("사용자를 찾을 수 없습니다: " + userIdx));
        
        // 주문번호가 activityDetails에 포함되어 있으면 중복으로 간주
        String orderId = extractOrderId(activityDetails);
        boolean exists = false;
        if (orderId != null) {
            exists = userActivityLogRepository.existsByUser_UserIdxAndActivityTypeAndActivityDetailsContaining(userIdx, activityType, orderId);
        }
        if (!exists) {
            logActivity(user, activityType, activityDetails, ipAddress);
        }
    }

    @Override
    @Transactional
    public void logActivity(User user, ActivityType activityType, String activityDetails, String ipAddress) {
        // 주문번호가 activityDetails에 포함되어 있으면 중복으로 간주
        String orderId = extractOrderId(activityDetails);
        boolean exists = false;
        if (orderId != null) {
            exists = userActivityLogRepository.existsByUser_UserIdxAndActivityTypeAndActivityDetailsContaining(user.getUserIdx(), activityType, orderId);
        }
        if (exists) return;
        UserActivityLog activityLog = UserActivityLog.builder()
                .user(user)
                .activityType(activityType)
                .activityDetails(activityDetails)
                .ipAddress(ipAddress)
                .build();
        userActivityLogRepository.save(activityLog);
    }
    
    @Override
    @Transactional
    public void logLogin(User user, String ipAddress) {
        logActivity(user, ActivityType.LOGIN, "사용자 로그인", ipAddress);
    }
    
    @Override
    @Transactional
    public void logLogout(User user, String ipAddress) {
        logActivity(user, ActivityType.LOGOUT, "사용자 로그아웃", ipAddress);
    }

    @Override
    public List<UserActivityLogResponseDTO> getAllLogs() {
        List<UserActivityLog> allLogs = userActivityLogRepository.findAll();
        return allLogs.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogResponseDTO> getLogsByUser(Long userIdx) {
        List<UserActivityLog> logs = userActivityLogRepository.findByUserUserIdx(userIdx);
        return logs.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogResponseDTO> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        List<UserActivityLog> logs = userActivityLogRepository.findByCreatedAtBetween(start, end);
        return logs.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogResponseDTO> getLogsByActivityType(ActivityType activityType) {
        // 이 메서드는 QueryDSL로 구현하는 것이 좋지만, 간단한 구현을 위해 모든 로그를 가져와 필터링합니다.
        List<UserActivityLog> allLogs = userActivityLogRepository.findAll();
        return allLogs.stream()
                .filter(log -> log.getActivityType() == activityType)
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    private UserActivityLogResponseDTO toDto(UserActivityLog log) {
        return UserActivityLogResponseDTO.builder()
                .logIdx(log.getLogIdx())
                .userIdx(log.getUser().getUserIdx())
                .userName(log.getUser().getName())
                .activityType(log.getActivityType())
                .activityDetails(log.getActivityDetails())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }

    /**
     * activityDetails에서 '주문번호=ORDER_xxx' 또는 '예약번호=xxx' 패턴을 추출
     */
    private String extractOrderId(String activityDetails) {
        if (activityDetails == null) return null;
        String[] patterns = {"주문번호=", "예약번호="};
        for (String pattern : patterns) {
            int idx = activityDetails.indexOf(pattern);
            if (idx >= 0) {
                int endIdx = activityDetails.indexOf(',', idx);
                if (endIdx == -1) endIdx = activityDetails.length();
                return activityDetails.substring(idx + pattern.length(), endIdx).trim();
            }
        }
        return null;
    }
}
