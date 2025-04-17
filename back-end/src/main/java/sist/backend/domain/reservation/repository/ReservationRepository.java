package sist.backend.domain.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.room.entity.Room;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
        Optional<Reservation> findByReservationNumOptional(String reservationNum);
        Optional<Reservation> findByUser_UserIdxAndReservationNum(Long userIdx, String reservationNum);
        @Query("""
                SELECT r.room.roomIdx FROM Reservation r
                WHERE r.checkIn < :checkOut AND r.checkOut > :checkIn
                """)
                List<Long> findReservedRoomIds(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);
                @Query("SELECT r.roomType.roomTypesIdx, COUNT(r) FROM Room r " +
                "WHERE (:reservedRoomIds IS NULL OR r.roomIdx NOT IN :reservedRoomIds) " +
                "GROUP BY r.roomType.roomTypesIdx")
         List<Object[]> countAvailableRoomsByRoomType(@Param("reservedRoomIds") List<Long> reservedRoomIds);
        @Query("SELECT r FROM Reservation r WHERE r.room = :room " +
       "AND r.checkOut > :checkInDate " +
       "AND r.checkIn < :checkOutDate")
        List<Reservation> findOverlappingReservations(
                @Param("room") Room room,
                @Param("checkInDate") LocalDate checkInDate,
                @Param("checkOutDate") LocalDate checkOutDate
                );
                
    Optional<Reservation> findByReservationNum(String reservationNum);

    Optional<Reservation> findByLastNameAndFirstNameAndPhone(String lastName, String firstName, String phone);

        
}
