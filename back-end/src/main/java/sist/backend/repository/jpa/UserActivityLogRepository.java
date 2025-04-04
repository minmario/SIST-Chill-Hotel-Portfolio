package sist.backend.repository.jpa;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.entity.UserActivityLog;

@Repository
public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {
    List<UserActivityLog> findByUserUserIdx(Long userIdx);
    List<UserActivityLog> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
