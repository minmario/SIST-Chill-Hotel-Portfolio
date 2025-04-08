package sist.backend.domain.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.room.entity.RoomType;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
        Optional<Reservation> findByUserIdxAndReservationNum(Long userIdx, String reservationNum);
        List<RoomType> findByRoomTypesIdxIn(List<Long> roomTypesIdxList);
        
        @Query("""
                SELECT r.roomIdx FROM Reservation r
                WHERE r.checkInDate < :checkOut AND r.checkOutDate > :checkIn
                """)
                List<Long> findReservedRoomIds(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

        @Query("""
        SELECT r.roomTypesIdx, COUNT(r) FROM Room r
        WHERE (:reservedRoomIds IS NULL OR r.roomIdx NOT IN :reservedRoomIds)
        GROUP BY r.roomTypesIdx
        """)
        List<Object[]> countAvailableRoomsByRoomType(@Param("reservedRoomIds") List<Long> reservedRoomIds);

        @Query("SELECT r FROM Reservation r WHERE r.room = :room " +
       "AND r.checkOutDate > :checkInDate " +
       "AND r.checkInDate < :checkOutDate")
        List<Reservation> findOverlappingReservations(
                @Param("room") Room room,
                @Param("checkInDate") LocalDate checkInDate,
                @Param("checkOutDate") LocalDate checkOutDate
                );
        
}
