package sist.backend.domain.dining_admin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.repository.jpa.DiningReservationRepository;

@Service
@RequiredArgsConstructor
public class AdminDiningService {

    private final DiningReservationRepository reservationRepository;

    @Transactional
    public void updateReservationStatus(String reservationNum, String newStatus) {
        DiningReservation reservation = reservationRepository.findByReservationNum(reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약번호를 찾을 수 없습니다."));
        reservation.setStatus(newStatus);
    }

    @Transactional
    public void deleteReservation(String reservationNum) {
        DiningReservation reservation = reservationRepository.findByReservationNum(reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약번호를 찾을 수 없습니다."));
        reservationRepository.delete(reservation);
    }
} 
