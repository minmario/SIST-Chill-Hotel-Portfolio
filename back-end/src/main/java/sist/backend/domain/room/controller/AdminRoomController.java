package sist.backend.domain.room.controller;

import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.room.dto.response.RoomMinimalResponse;
import sist.backend.domain.room.service.AdminRoomService;


import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/admin/rooms")
@RequiredArgsConstructor
public class AdminRoomController {


    private final AdminRoomService roomService;

    @GetMapping("/minimal")
    public List<Map<String, Object>> getMinimalRooms() {
        // 서비스에서 필요한 필드만 추출해서 반환
        List<RoomMinimalResponse> rooms = roomService.getMinimalRooms();
        return rooms.stream().map(room -> {
            Map<String, Object> map = new HashMap<>();
            map.put("roomIdx", room.getRoomIdx());
            map.put("roomNum", room.getRoomNum());
            map.put("roomTypeIdx", room.getRoomTypeIdx());
            return map;
        }).collect(Collectors.toList());
    }
}