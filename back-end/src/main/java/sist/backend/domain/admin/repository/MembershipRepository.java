package sist.backend.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.admin.entity.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
}
