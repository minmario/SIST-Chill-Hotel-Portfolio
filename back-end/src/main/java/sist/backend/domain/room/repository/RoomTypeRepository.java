package sist.backend.domain.room.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import sist.backend.domain.room.entity.RoomType;

public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    // 1. 전체 RoomType 개수를 RoomType 기준으로 묶어서 세는 쿼리
    @Query("SELECT rt.roomTypesIdx, COUNT(rt) FROM RoomType rt GROUP BY rt.roomTypesIdx")
    List<Object[]> countAllRoomTypesGroupedByType();

    // 방 타입 ID로 방 타입을 찾는 메서드
    List<RoomType> findByRoomTypesIdxIn(List<Long> roomTypesIdxList);

}
