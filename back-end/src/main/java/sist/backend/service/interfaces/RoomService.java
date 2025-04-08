package sist.backend.service.interfaces;

import sist.backend.dto.response.RoomResponse;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    List<RoomResponse> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, int guests);
}