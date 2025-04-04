package sist.backend.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sist.backend.dto.response.UserActivityLogResponseDto;
import sist.backend.entity.User;
import sist.backend.entity.UserActivityLog;
import sist.backend.entity.enums.ActivityType;
import sist.backend.exception.custom.ResourceNotFoundException;
import sist.backend.repository.jpa.UserActivityLogRepository;
import sist.backend.repository.jpa.UserRepository;
import sist.backend.service.interfaces.UserActivityLogService;

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
        
        UserActivityLog log = UserActivityLog.builder()
                .user(user)
                .activityType(activityType)
                .activityDetails(activityDetails)
                .ipAddress(ipAddress)
                .createdAt(LocalDateTime.now())
                .build();
        
        userActivityLogRepository.save(log);
    }

    @Override
    public List<UserActivityLogResponseDto> getLogsByUser(Long userIdx) {
        List<UserActivityLog> logs = userActivityLogRepository.findByUserUserIdx(userIdx);
        return logs.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogResponseDto> getLogsByDateRange(LocalDateTime start, LocalDateTime end) {
        List<UserActivityLog> logs = userActivityLogRepository.findByCreatedAtBetween(start, end);
        return logs.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserActivityLogResponseDto> getLogsByActivityType(ActivityType activityType) {
        // 이 메서드는 QueryDSL로 구현하는 것이 좋지만, 간단한 구현을 위해 모든 로그를 가져와 필터링합니다.
        List<UserActivityLog> allLogs = userActivityLogRepository.findAll();
        return allLogs.stream()
                .filter(log -> log.getActivityType() == activityType)
                .map(this::toDto)
                .collect(Collectors.toList());
    }
    
    private UserActivityLogResponseDto toDto(UserActivityLog log) {
        return UserActivityLogResponseDto.builder()
                .logIdx(log.getLogIdx())
                .userIdx(log.getUser().getUserIdx())
                .userName(log.getUser().getName())
                .activityType(log.getActivityType())
                .activityDetails(log.getActivityDetails())
                .ipAddress(log.getIpAddress())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
