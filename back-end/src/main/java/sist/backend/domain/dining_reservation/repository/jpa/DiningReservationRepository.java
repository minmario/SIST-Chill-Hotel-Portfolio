package sist.backend.domain.dining_reservation.repository.jpa;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import sist.backend.domain.dining_reservation.entity.DiningReservation;

import java.time.LocalDate;
import java.time.LocalTime;

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
}
