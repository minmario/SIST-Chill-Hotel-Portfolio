package sist.backend.domain.dining_admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_admin.service.AdminDiningService;

@RestController
@RequestMapping("/admin/dining")
@RequiredArgsConstructor
public class AdminDiningDeleteController {

    private final AdminDiningService adminDiningService;

    @DeleteMapping("/{reservationNum}")
    public ResponseEntity<Void> deleteReservation(@PathVariable("reservationNum") String reservationNum) {
        try {
            adminDiningService.deleteReservation(reservationNum);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}
