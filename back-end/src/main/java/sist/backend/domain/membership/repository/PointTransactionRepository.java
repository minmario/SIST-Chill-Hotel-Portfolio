package sist.backend.domain.membership.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import sist.backend.domain.membership.entity.PointTransaction;

public interface PointTransactionRepository extends JpaRepository<PointTransaction, Long> {

    @Query("SELECT COALESCE(SUM(p.point), 0) FROM PointTransaction p WHERE p.user.userIdx = :userIdx")
    int sumPointsByUserId(Long userIdx);
}
