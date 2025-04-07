package sist.backend.domain.reservation.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.reservation.entity.ReservationEntity;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
    List<ReservationEntity> findByUserIdx(Long userIdx);

    Optional<ReservationEntity> findByReservationNum(String reservationNum);
}
