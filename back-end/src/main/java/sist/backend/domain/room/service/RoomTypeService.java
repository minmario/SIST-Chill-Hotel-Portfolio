package sist.backend.domain.room.service;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.reservation.repository.ReservationRepository;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.room.entity.RoomType;
import sist.backend.domain.room.dto.response.RoomTypeResponse;
import sist.backend.domain.room.repository.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final ReservationRepository reservationRepository;

    public List<RoomTypeResponse> getAvailableRoomTypes(LocalDate checkIn, LocalDate checkOut,
                                                        int roomCount, int adults, int children) {
        int totalPeople = adults + children;
        int maxPeoplePerRoom = 4;

        if (adults < 1) {
            throw new IllegalArgumentException("최소 성인 1명 이상 필요합니다.");
        }

        if (totalPeople > roomCount * maxPeoplePerRoom) {
            throw new IllegalArgumentException("객실 수에 비해 인원이 너무 많습니다.");
        }

        List<RoomType> allRoomTypes = roomTypeRepository.findAll();

        return allRoomTypes.stream()
            .filter(rt -> rt.getMaxPeople() >= Math.ceil((double) totalPeople / roomCount))
            .map((RoomType rt) -> {
                long availableCount = rt.getRooms().stream()
                    .filter(room -> {
                        List<Reservation> overlapping = reservationRepository.findOverlappingReservations(
                                room, checkIn, checkOut
                        );
                        return overlapping.isEmpty();
                    })
                    .count();

                    return RoomTypeResponse.builder()
                    .roomTypesIdx(rt.getRoomTypesIdx())
                    .roomName(rt.getRoomName())
                    .grade(rt.getGrade())
                    .size(rt.getSize())
                    .viewType(rt.getViewType())
                    .maxPeople(rt.getMaxPeople())
                    .description(rt.getDescription())
                    .weekPrice(rt.getWeekPrice())
                    .weekendPrice(rt.getWeekendPrice())
                    .peakWeekPrice(rt.getPeakWeekPrice())
                    .peakWeekendPrice(rt.getPeakWeekendPrice())
                    .totalCount(rt.getTotalCount())
                    .availableCount((int) availableCount)
                    .roomImage(rt.getRoomImage())
                    .build();

                     
            })
            .filter(resp -> resp.getAvailableCount() >= roomCount)
            .collect(Collectors.toList());
    }
}