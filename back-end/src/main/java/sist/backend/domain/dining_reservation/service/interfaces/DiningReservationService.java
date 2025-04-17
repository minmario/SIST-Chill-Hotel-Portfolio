package sist.backend.domain.dining_reservation.service.interfaces;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import sist.backend.domain.dining_reservation.dto.request.DiningReservationRequest;
import sist.backend.domain.dining_reservation.dto.response.DiningReservationResponse;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.repository.jpa.DiningReservationRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiningReservationService {

    private final DiningReservationRepository reservationRepository;

    public DiningReservation save(DiningReservation reservation) {
        int requestedTotal = reservation.getAdults() + reservation.getChildren();

        // 1. 예약 인원 제한 (1~5명)
        if (requestedTotal < 1 || requestedTotal > 5) {
            throw new IllegalArgumentException("예약 인원은 최소 1명 이상, 최대 5명까지 가능합니다.");
        }

        // 2. 시간대별 누적 인원 제한
        int alreadyReserved = reservationRepository.countPeopleByRestaurantIdAndReservationDateAndReservationTime(
                reservation.getRestaurantId(), reservation.getReservationDate(), reservation.getReservationTime());
        if (alreadyReserved + requestedTotal > 20) {
            throw new IllegalStateException("해당 시간대에는 이미 예약이 마감되었습니다. 다른 시간을 선택해주세요.");
        }

        reservation.setReservationNum(generateUniqueCode());
        return reservationRepository.save(reservation);
    }

    public int getReservedPeopleCount(Long restaurantId, LocalDate date, LocalTime time) {
        return reservationRepository.countPeopleByRestaurantIdAndReservationDateAndReservationTime(restaurantId, date,
                time);
    }

    private String generateUniqueCode() {
        String code;
        do {
            code = "RS" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } while (reservationRepository.existsByReservationNum(code));
        return code;
    }

    public DiningReservation fromDTO(DiningReservationRequest dto) {
        return DiningReservation.builder()
                .restaurantId(dto.getRestaurantId())
                .reservationDate(dto.getReservationDate())
                .mealTime(dto.getMealTime())
                .reservationTime(LocalTime.parse(dto.getReservationTime()))
                .adults(dto.getAdults())
                .children(dto.getChildren())
                .firstName(dto.getFirstName())
                .lastName(dto.getLastName())
                .phone(dto.getPhone())
                .email(dto.getEmail())
                .request(dto.getRequest())
                .build();
    }

    @Transactional
    public void updateReservationStatus(Long id, String status) {
        DiningReservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 예약이 존재하지 않습니다."));

        reservation.setStatus(status);
        reservation.setUpdatedAt(LocalDateTime.now());
    }

    public List<DiningReservationResponse> getReservationsByDate(String date) {
        LocalDate parsedDate = LocalDate.parse(date); // "2025-04-17" 형식
        List<DiningReservation> reservations = reservationRepository.findByReservationDate(parsedDate);

        return reservations.stream()
                .map(DiningReservationResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
