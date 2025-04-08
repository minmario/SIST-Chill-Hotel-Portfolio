package sist.backend.domain.admin.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.admin.entity.Reservation;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByReservationNum(String reservationNum);
}
