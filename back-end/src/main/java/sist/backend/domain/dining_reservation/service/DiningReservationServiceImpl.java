package sist.backend.domain.dining_reservation.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sist.backend.domain.dining_reservation.dto.request.DiningReservationRequest;
import sist.backend.domain.dining_reservation.dto.response.DiningReservationResponse;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.repository.jpa.DiningReservationRepository;
import sist.backend.domain.dining_reservation.service.interfaces.DiningReservationService;
import sist.backend.domain.restaurant.entity.Restaurant;
import sist.backend.domain.restaurant.repository.RestaurantRepository;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DiningReservationServiceImpl implements DiningReservationService {

    private final DiningReservationRepository reservationRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
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

    // 예약 번호로 예약 조회
    @Override
    public DiningReservationResponse findByReservationNumber(String reservationNum) {
        DiningReservation reservation = reservationRepository.findByReservationNum(reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));
    
        String restaurantName = restaurantRepository.findById(reservation.getRestaurantId())
                .map(r -> r.getName())
                .orElse(null);
    
        return DiningReservationResponse.builder()
                .reservationNum(reservation.getReservationNum())
                .restaurantId(reservation.getRestaurantId())
                .restaurantName(restaurantName) // ✅ 레스토랑 이름 세팅
                .reservationDate(reservation.getReservationDate() != null ? reservation.getReservationDate().toString() : null)
                .reservationTime(reservation.getReservationTime() != null ? reservation.getReservationTime().toString() : null)
                .mealTime(reservation.getMealTime())
                .adults(reservation.getAdults())
                .children(reservation.getChildren())
                .firstName(reservation.getFirstName())
                .lastName(reservation.getLastName())
                .phone(reservation.getPhone())
                .email(reservation.getEmail())
                .request(reservation.getRequest())
                .status(reservation.getStatus() != null ? reservation.getStatus() : "PENDING")
                .build();
    }
    

    // 예약자 정보로 예약 조회
    @Override
    public DiningReservationResponse findByGuestInfo(String lastName, String firstName, String phone) {
        DiningReservation reservation = reservationRepository.findByLastNameAndFirstNameAndPhone(lastName, firstName, phone)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        String restaurantName = restaurantRepository.findById(reservation.getRestaurantId())
                .map(Restaurant::getName)
                .orElse(null);

        return DiningReservationResponse.builder()
                .reservationNum(reservation.getReservationNum())
                .restaurantId(reservation.getRestaurantId())
                .restaurantName(restaurantName) // ✅ 여기 추가
                .reservationDate(reservation.getReservationDate() != null ? reservation.getReservationDate().toString() : null)
                .reservationTime(reservation.getReservationTime() != null ? reservation.getReservationTime().toString() : null)
                .mealTime(reservation.getMealTime())
                .adults(reservation.getAdults())
                .children(reservation.getChildren())
                .firstName(reservation.getFirstName())
                .lastName(reservation.getLastName())
                .phone(reservation.getPhone())
                .email(reservation.getEmail())
                .request(reservation.getRequest())
                .status(reservation.getStatus() != null ? reservation.getStatus() : "PENDING")
                .build();
    }

    @Override
    @Transactional
    public void cancelReservation(String reservationNum) {
        DiningReservation reservation = reservationRepository.findByReservationNum(reservationNum)
                .orElseThrow(() -> new IllegalArgumentException("예약 정보를 찾을 수 없습니다."));

        // ✅ 이미 취소된 경우
        if ("CANCELLED".equalsIgnoreCase(reservation.getStatus())) {
            throw new IllegalStateException("이미 취소된 예약입니다.");
        }

        // ✅ 취소 처리
        reservation.setStatus("CANCELLED");
    }

}
