package sist.backend.domain.admin.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;

@Repository
public interface AdminUserRepository extends JpaRepository<User, Long> {
    boolean existsById(String id);

    boolean existsByEmail(String email);

    Optional<User> findById(String id);

    /** 최근 7일 이내 가입한 회원 조회 */
    List<User> findByRoleAndCreatedAtAfterOrderByCreatedAtDesc(UserRole role, LocalDateTime createdAt);

    /** 특정 권한(role)을 가진 회원 수 */
    Long countByRole(UserRole role);

    long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

    long countByCreatedAtBefore(LocalDateTime dateTime);

    long countByRoleAndCreatedAtBetween(UserRole role, LocalDateTime start, LocalDateTime end);

    List<User> findByRoleIn(List<UserRole> roles);
}