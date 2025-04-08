package sist.backend.service.impl;

import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.room.entity.RoomType;
import sist.backend.dto.response.RoomTypeResponse;
import sist.backend.repository.jpa.ReservationRepository;
import sist.backend.repository.jpa.RoomRepository;
import sist.backend.repository.jpa.RoomTypeRepository;
import sist.backend.service.interfaces.RoomTypeService;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomTypeServiceImpl implements RoomTypeService {

    private final RoomTypeRepository roomTypeRepository;
    private final ReservationRepository reservationRepository;

    @Override
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
                        .roomTypeName(rt.getRoomTypeName())
                        .price(rt.getPrice())
                        .description(rt.getDescription())
                        .maxPeople(rt.getMaxPeople())
                        .image(rt.getImage())
                        .totalCount(rt.getRooms().size())
                        .availableCount((int) availableCount)
                        .build();
            })
            .filter(resp -> resp.getAvailableCount() >= roomCount)
            .collect(Collectors.toList());
    }
}