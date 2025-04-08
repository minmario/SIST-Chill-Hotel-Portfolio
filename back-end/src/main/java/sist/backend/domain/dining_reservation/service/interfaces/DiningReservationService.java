package sist.backend.domain.dining_reservation.service.interfaces;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.repository.jpa.DiningReservationRepository;

import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiningReservationService {

    private final DiningReservationRepository reservationRepository;

    public DiningReservation save(DiningReservation reservation) {
        reservation.setReservationNum(generateUniqueCode());
        return reservationRepository.save(reservation);
    }

    private String generateUniqueCode() { // UUid를 사용하여 고유한 예약 번호 생성
        String code;
        do {
            code = "RS" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (reservationRepository.existsByReservationNum(code));
        return code;
    }
}
