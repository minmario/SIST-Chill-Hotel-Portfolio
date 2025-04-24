package sist.backend.domain.membership.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sist.backend.domain.membership.entity.PointTransaction;

public interface PointTransactionRepository extends JpaRepository<PointTransaction, Long> {
    List<PointTransaction> findByUser_UserIdxAndTransactionDateBetweenOrderByTransactionDateAsc(
            Long userIdx, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COALESCE(SUM(p.point), 0) FROM PointTransaction p WHERE p.user.userIdx = :userIdx")
    Integer findTotalPointByUserIdx(@Param("userIdx") Long userIdx);

    List<PointTransaction> findByUser_UserIdxAndExpirationDateBefore(Long userIdx, LocalDateTime now);

}
