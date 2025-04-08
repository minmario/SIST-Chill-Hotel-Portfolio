package sist.backend.domain.room.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import sist.backend.domain.room.entity.Room;

import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {

    // 예약되지 않은 방을 찾기 위한 커스텀 조건
    List<Room> findByRoomIdxNotIn(List<Long> reservedRoomIds);

    // 1. 전체 Room 개수를 RoomType 기준으로 묶어서 세는 쿼리
    @Query("SELECT r.roomType.roomTypesIdx, COUNT(r) FROM Room r GROUP BY r.roomType.roomTypesIdx")
    List<Object[]> countAllRoomsGroupedByType();

    // 2. 예약 가능한 Room만 RoomType 기준으로 묶어서 세는 쿼리
    @Query("SELECT r.roomType.roomTypesIdx, COUNT(r) FROM Room r " +
       "WHERE (:reservedRoomIds IS NULL OR r.roomIdx NOT IN :reservedRoomIds) " +
       "GROUP BY r.roomType.roomTypesIdx")
    List<Object[]> countAvailableRoomsByRoomType(List<Long> reservedRoomIds);
}