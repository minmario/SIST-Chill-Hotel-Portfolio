package sist.backend.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.admin.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsById(String id);

    boolean existsByEmail(String email);
}