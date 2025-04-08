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
 }
