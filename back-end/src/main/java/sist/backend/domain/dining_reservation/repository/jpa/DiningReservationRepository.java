package sist.backend.domain.dining_reservation.repository.jpa;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import sist.backend.domain.dining_reservation.entity.DiningReservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface DiningReservationRepository extends CrudRepository<DiningReservation, Long> {

   @Query("SELECT COALESCE(SUM(r.adults + r.children), 0) FROM DiningReservation r " +
       "WHERE r.restaurantId = :restaurantId AND r.reservationDate = :reservationDate " +
       "AND r.mealTime = :mealTime AND r.reservationTime = :reservationTime")
        int countReservedPeople(
            @Param("restaurantId") Long restaurantId,
            @Param("reservationDate") LocalDate reservationDate,
            @Param("mealTime") String mealTime,
            @Param("reservationTime") LocalTime reservationTime
        );

        // 관리자
        List<DiningReservation> findByReservationDate(LocalDate date);

        // 관리자, 사용자 예약 번호로 조회
        Optional<DiningReservation> findByReservationNum(String reservationNum);

        // ✅ 예약자 정보(성, 이름, 전화번호)로 조회
        Optional<DiningReservation> findByLastNameAndFirstNameAndPhone(String lastName, String firstName, String phone);
}
