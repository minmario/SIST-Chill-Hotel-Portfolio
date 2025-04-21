package sist.backend.domain.user.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.user.entity.UserActivityLog;

@Repository
public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {
    List<UserActivityLog> findByUserUserIdx(Long userIdx);
    List<UserActivityLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    boolean existsByUser_UserIdxAndActivityTypeAndActivityDetailsAndIpAddress(Long userIdx, sist.backend.domain.user.entity.ActivityType activityType, String activityDetails, String ipAddress);

    // 주문번호가 activityDetails에 포함되어 있으면 중복으로 간주
    boolean existsByUser_UserIdxAndActivityTypeAndActivityDetailsContaining(Long userIdx, sist.backend.domain.user.entity.ActivityType activityType, String orderId);

}
