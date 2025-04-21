package sist.backend.domain.dining_admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_admin.dto.response.AdminScheduleResponse;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.repository.jpa.DiningReservationRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/dining")
@RequiredArgsConstructor
public class DiningAdminController {

    private final DiningReservationRepository reservationRepository;

    @GetMapping("/schedule")
    public List<AdminScheduleResponse> getScheduleByDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        List<DiningReservation> reservations = reservationRepository.findByReservationDate(date);

        return reservations.stream()
                .map(AdminScheduleResponse::from)
                .collect(Collectors.toList());
    }
}
