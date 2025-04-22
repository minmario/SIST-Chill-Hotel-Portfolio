package sist.backend.domain.admin.service.service;

import sist.backend.domain.admin.dto.response.StaffAdminResponse;
import sist.backend.domain.admin.dto.request.StaffAdminRequest;
import sist.backend.domain.admin.dto.request.UpdateStaffPasswordRequest;

import java.util.List;

public interface StaffAdminService {
    List<StaffAdminResponse> getAllStaff();

    void addStaff(StaffAdminRequest request);

    void updateStaff(Long id, StaffAdminRequest request);

    void resetPassword(Long id);

    void deleteStaff(Long id);

    void updateStaffStatus(Long userIdx, String status);

    void changePassword(Long id, UpdateStaffPasswordRequest request);

}
