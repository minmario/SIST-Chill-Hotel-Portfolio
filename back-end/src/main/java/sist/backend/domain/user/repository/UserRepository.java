package sist.backend.domain.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // PK(Long userIdx)로 조회: JpaRepository 기본 제공
    // 아이디(문자열)로 조회: 아래 메서드 추가
    Optional<User> findByIdIs(String id);
    Optional<User> findById(String id);

    boolean existsByEmail(String email);
    boolean existsById(String id);
    Optional<User> findByUserIdx(Long userIdx);

    Optional<User> findByEmail(String email);
}
