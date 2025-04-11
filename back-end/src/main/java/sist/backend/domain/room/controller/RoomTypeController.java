package sist.backend.domain.room.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.room.dto.response.RoomTypeResponse;
import sist.backend.domain.room.service.RoomTypeService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/room-types")
@RequiredArgsConstructor
public class RoomTypeController {

    private final RoomTypeService roomTypeService;

    @GetMapping("/available")
    public ResponseEntity<List<RoomTypeResponse>> getAvailableRoomTypes(
            @RequestParam("checkInDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkInDate,
            @RequestParam("checkOutDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOutDate,
            @RequestParam("roomCount") int roomCount,
            @RequestParam("adults") int adults,
            @RequestParam("children") int children
    ) {
        System.out.println("roomTypeController - getAvailableRoomTypes() called");
        List<RoomTypeResponse> result = roomTypeService.getAvailableRoomTypes(
                checkInDate, checkOutDate, roomCount, adults, children
        );
        return ResponseEntity.ok(result);
    }
}