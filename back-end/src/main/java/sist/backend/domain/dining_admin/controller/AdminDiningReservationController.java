package sist.backend.domain.dining_admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_reservation.dto.response.DiningReservationResponse;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.repository.jpa.DiningReservationRepository;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin/dining")
@RequiredArgsConstructor
public class AdminDiningReservationController {

    private final DiningReservationRepository reservationRepository;

    @GetMapping("/reservations")
    public List<DiningReservationResponse> getReservationsByDate(@RequestParam("date") String date) {
        LocalDate reservationDate = LocalDate.parse(date);
        return reservationRepository.findByReservationDate(reservationDate).stream()
                .map(DiningReservationResponse::fromEntity)
                .toList();
    }
}