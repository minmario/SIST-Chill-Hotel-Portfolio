package sist.backend.domain.dining_reservation.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.dining_reservation.entity.DiningReservation;

@Repository
public interface DiningReservationRepository extends JpaRepository<DiningReservation, Long> {

    boolean existsByReservationNum(String reservationNum);
}
