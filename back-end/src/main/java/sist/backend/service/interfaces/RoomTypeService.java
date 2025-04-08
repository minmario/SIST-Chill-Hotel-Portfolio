package sist.backend.service.interfaces;

import sist.backend.dto.response.RoomTypeResponse;

import java.time.LocalDate;
import java.util.List;

public interface RoomTypeService {

    List<RoomTypeResponse> getAvailableRoomTypes(LocalDate checkIn, LocalDate checkOut, int roomCount, int adults, int children);
}