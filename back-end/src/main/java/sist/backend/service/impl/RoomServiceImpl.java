package sist.backend.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sist.backend.dto.response.RoomResponse;
import sist.backend.domain.room.entity.Room;
import sist.backend.repository.jpa.ReservationRepository;
import sist.backend.repository.jpa.RoomRepository;
import sist.backend.service.interfaces.RoomService;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    @Override
    public List<RoomResponse> getAvailableRooms(LocalDate checkIn, LocalDate checkOut,int guests) {
        // 해당 날짜 사이에 예약된 방들의 roomIdx 조회
        List<Long> reservedRoomIds = reservationRepository.findReservedRoomIds(checkIn, checkOut);

        // 예약된 방이 없다면 전체 방 반환
        List<Room> availableRooms = (reservedRoomIds == null || reservedRoomIds.isEmpty())
                ? roomRepository.findAll()
                : roomRepository.findByRoomIdxNotIn(reservedRoomIds);

        // Room → RoomResponse로 매핑
        return availableRooms.stream()
                .map(RoomResponse::fromEntity)
                .collect(Collectors.toList());
    }
}