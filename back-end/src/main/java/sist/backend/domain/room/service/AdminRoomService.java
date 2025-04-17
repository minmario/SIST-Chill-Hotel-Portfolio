package sist.backend.domain.room.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.room.dto.response.RoomMinimalResponse;
import sist.backend.domain.room.repository.RoomRepository;

@Service
@RequiredArgsConstructor
public class AdminRoomService {
    private  final RoomRepository roomRepository; 
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public List<RoomMinimalResponse> getMinimalRooms() {
        return roomRepository.findAll().stream()
                .map(room -> RoomMinimalResponse.builder()
                        .roomIdx(room.getRoomIdx())
                        .roomNum(room.getRoomNum())
                        .roomTypeIdx(room.getRoomType().getRoomTypesIdx())
                        .build())
                .collect(Collectors.toList());
    }
}
