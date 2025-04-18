package sist.backend.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.admin.dto.response.StaffAdminResponse;
import sist.backend.domain.admin.dto.request.StaffAdminRequest;
import sist.backend.domain.admin.dto.request.UpdateStaffPasswordRequest;
import sist.backend.domain.admin.dto.request.UpdateStaffStatusRequest;
import sist.backend.domain.admin.service.service.StaffAdminService;

import java.util.List;

@RestController
@RequestMapping("/api/admin/staff") // ✅ 변경
@RequiredArgsConstructor
public class StaffAdminController {
    private final StaffAdminService staffAdminService;

    @GetMapping
    public ResponseEntity<List<StaffAdminResponse>> getAllStaff() {
        return ResponseEntity.ok(staffAdminService.getAllStaff());
    }

    @PostMapping
    public ResponseEntity<Void> addStaff(@RequestBody StaffAdminRequest request) {
        staffAdminService.addStaff(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateStaff(@PathVariable Long id, @RequestBody StaffAdminRequest request) {
        staffAdminService.updateStaff(id, request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long id) {
        staffAdminService.resetPassword(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStaff(@PathVariable Long id) {
        staffAdminService.deleteStaff(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userIdx}/status")
    public ResponseEntity<Void> updateStaffStatus(
            @PathVariable Long userIdx,
            @RequestBody UpdateStaffStatusRequest request) {
        staffAdminService.updateStaffStatus(userIdx, request.getStatus());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(
            @PathVariable Long id,
            @RequestBody UpdateStaffPasswordRequest request) {
        staffAdminService.changePassword(id, request);
        return ResponseEntity.ok().build();
    }
}