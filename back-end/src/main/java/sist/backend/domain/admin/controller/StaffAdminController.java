package sist.backend.domain.admin.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sist.backend.domain.admin.dto.response.StaffAdminResponse;
import sist.backend.domain.admin.dto.request.StaffAdminRequest;
import sist.backend.domain.admin.service.service.StaffAdminService;

import java.util.List;

@RestController
@RequestMapping("/admin/staff")
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
}
