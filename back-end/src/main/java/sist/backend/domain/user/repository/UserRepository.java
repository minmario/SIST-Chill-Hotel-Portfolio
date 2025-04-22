package sist.backend.domain.user.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findById(String id);

    boolean existsById(String id);

    boolean existsByEmail(String email);

    Optional<User> findByUserIdx(Long userIdx);

    Optional<User> findByEmail(String email);
}
