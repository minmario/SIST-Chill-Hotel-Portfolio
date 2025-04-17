package sist.backend.domain.dining_reservation.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sist.backend.domain.dining_reservation.entity.DiningReservation;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DiningReservationRepository extends JpaRepository<DiningReservation, Long> {

        boolean existsByReservationNum(String reservationNum);

        // 예약 인원 제한 검증
        @Query("SELECT COALESCE(SUM(r.adults + r.children), 0) FROM DiningReservation r " +
                        "WHERE r.restaurantId = :restaurantId AND r.reservationDate = :date AND r.reservationTime = :time")
        int countPeopleByRestaurantIdAndReservationDateAndReservationTime(
                        @Param("restaurantId") Long restaurantId,
                        @Param("date") LocalDate date,
                        @Param("time") LocalTime time);

        List<DiningReservation> findByReservationDate(LocalDate reservationDate);

        
}
