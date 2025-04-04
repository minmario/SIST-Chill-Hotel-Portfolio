package java.sist.backend.repository.jpa;


import java.sist.backend.entity.reservation.ReservationEntity;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<ReservationEntity, Long> {
        // 예약번호(id)로 단건 조회
        Optional<ReservationEntity> findById(Long id);

        // 이름으로 여러 예약 조회
        List<ReservationEntity> findByName(String name);
    
        // ✅ user_idx와 reservation_num으로 단건 조회
        Optional<ReservationEntity> findByUserIdxAndReservationNum(Long userIdx, String reservationNum);
}