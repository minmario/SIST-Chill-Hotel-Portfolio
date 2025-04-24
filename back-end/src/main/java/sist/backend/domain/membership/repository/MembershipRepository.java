package sist.backend.domain.membership.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import sist.backend.domain.membership.entity.Membership;

public interface MembershipRepository extends JpaRepository<Membership, Long> {
    List<Membership> findAllByOrderByRequiredStaysAsc();

    @Query("SELECT m FROM Membership m WHERE m.requiredPoint <= :point ORDER BY m.requiredPoint DESC")
    List<Membership> findAvailableTiersByPoint(@Param("point") int point);

    List<Membership> findAllByOrderByRequiredPointAsc();
}
