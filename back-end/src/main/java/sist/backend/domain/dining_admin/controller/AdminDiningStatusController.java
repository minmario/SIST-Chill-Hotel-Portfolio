package sist.backend.domain.dining_admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.dining_admin.dto.request.StatusUpdateRequest;
import sist.backend.domain.dining_admin.service.AdminDiningService;

@RestController
@RequestMapping("/admin/dining")
@RequiredArgsConstructor
public class AdminDiningStatusController {

    private final AdminDiningService adminDiningService;

    @PostMapping("/status")
    public ResponseEntity<Void> updateStatus(@RequestBody StatusUpdateRequest request) {
        adminDiningService.updateReservationStatus(request.getReservationNum(), request.getStatus());
        return ResponseEntity.ok().build();
    }
} 
