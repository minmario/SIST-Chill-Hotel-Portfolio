package sist.backend.domain.admin.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.admin.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsById(String id);

    boolean existsByEmail(String email);

    Optional<User> findById(String id);
}