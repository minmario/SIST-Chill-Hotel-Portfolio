package sist.backend.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sist.backend.domain.admin.entity.AdminActivityLog;

@Repository
public interface AdminActivityLogRepository extends JpaRepository<AdminActivityLog, Long> {
    // 필요시 쿼리 메서드 추가
}
