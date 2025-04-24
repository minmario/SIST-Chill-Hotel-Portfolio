package sist.backend.domain.dining_reservation.service.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sist.backend.domain.dining_reservation.dto.request.DiningReservationRequest;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.repository.jpa.DiningReservationRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiningReservationService {

    private final DiningReservationRepository reservationRepository;

    @Transactional
    public String reserve(DiningReservationRequest request) {
        int totalPeople = request.getAdults() + request.getChildren();
        if (totalPeople > 5) {
            throw new IllegalArgumentException("한 예약당 최대 5명까지 예약 가능합니다.");
        }

        int reservedCount = reservationRepository.countReservedPeople(
                request.getRestaurantId(),
                request.getReservationDate(),
                request.getMealTime(),
                request.getReservationTime()
        );

        if (reservedCount + totalPeople > 20) {
            throw new IllegalArgumentException("해당 시간대는 예약 가능 인원을 초과했습니다.");
        }

        String reservationNum = UUID.randomUUID().toString().replaceAll("-", "").substring(0, 8).toUpperCase();

        DiningReservation reservation = DiningReservation.builder()
                .reservationNum(reservationNum)
                .restaurantId(request.getRestaurantId())
                .reservationDate(request.getReservationDate())
                .mealTime(request.getMealTime())
                .reservationTime(request.getReservationTime())
                .adults(request.getAdults())
                .children(request.getChildren())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phone(request.getPhone())
                .email(request.getEmail())
                .request(request.getRequest())
                .status("PENDING")
                .build();

        reservationRepository.save(reservation);
        return reservationNum;
    }
}
