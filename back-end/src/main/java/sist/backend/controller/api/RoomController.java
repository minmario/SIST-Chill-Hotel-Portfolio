package sist.backend.controller.api;

import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import sist.backend.dto.response.RoomResponse;
import sist.backend.dto.response.RoomTypeResponse;
import sist.backend.service.interfaces.RoomService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;


}
