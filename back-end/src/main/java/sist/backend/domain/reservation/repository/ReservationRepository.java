package sist.backend.domain.reservation.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.room.entity.Room;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

        List<Reservation> findByUser_UserIdxAndReservationNum(Long userIdx, String reservationNum);

        @Query("""
                        SELECT r.room.roomIdx FROM Reservation r
                        WHERE r.status != 'CANCELLED'
                        AND r.checkIn < :checkOut AND r.checkOut > :checkIn
                        """)
        List<Long> findReservedRoomIds(@Param("checkIn") LocalDate checkIn, @Param("checkOut") LocalDate checkOut);

        @Query("SELECT r.roomType.roomTypesIdx, COUNT(r) FROM Room r " +
                        "WHERE (:reservedRoomIds IS NULL OR r.roomIdx NOT IN :reservedRoomIds) " +
                        "GROUP BY r.roomType.roomTypesIdx")
        List<Object[]> countAvailableRoomsByRoomType(@Param("reservedRoomIds") List<Long> reservedRoomIds);

        @Query("""
                          SELECT r
                          FROM Reservation r
                          WHERE r.room = :room
                            AND r.status != 'CANCELLED'
                            AND r.checkOut > :checkInDate
                            AND r.checkIn < :checkOutDate
                        """)
        List<Reservation> findOverlappingReservations(
                        @Param("room") Room room,
                        @Param("checkInDate") LocalDate checkInDate,
                        @Param("checkOutDate") LocalDate checkOutDate);

        Optional<Reservation> findByReservationNum(String reservationNum);

        List<Reservation> findAllByReservationNum(String reservationNum);

        @Query("""
            SELECT r FROM Reservation r
            WHERE r.lastName = :lastName
              AND r.firstName = :firstName
              AND r.phone = :phone
            ORDER BY r.createdAt DESC
          """)
          List<Reservation> findByGuestInfo(
            @Param("lastName") String lastName,
            @Param("firstName") String firstName,
            @Param("phone") String phone
          );


        // 선택 사항
        @Modifying
        @Transactional
        @Query("UPDATE Reservation r SET r.status = 'CANCELLED' WHERE r.reservationNum = :reservationNum")
        void cancelReservationByNum(@Param("reservationNum") String reservationNum);

        @Query("""
                        SELECT r FROM Reservation r
                        WHERE r.user.userIdx = :userIdx
                        AND r.status IN ('CHECKED_IN', 'COMPLETED')
                        AND r.checkOut >= :cutoff
                        """)
        List<Reservation> findValidReservationsWithinOneYear(
                        @Param("userIdx") Long userIdx,
                        @Param("cutoff") LocalDate cutoff);

        @Query("SELECT r FROM Reservation r WHERE r.user.userIdx = :userIdx AND r.status = 'COMPLETED' AND r.checkIn >= :start AND r.checkOut <= :end")
        List<Reservation> findCompletedReservationsWithin(
                        @Param("userIdx") Long userIdx,
                        @Param("start") LocalDate start,
                        @Param("end") LocalDate end);

}
