package sist.backend.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.reservation.entity.Reservation;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByUserIdxAndReservationNum(Long userIdx, String reservationNum);
}
