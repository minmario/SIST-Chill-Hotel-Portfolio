package sist.backend.domain.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sist.backend.domain.admin.dto.response.StaffAdminResponse;
import sist.backend.domain.admin.repository.AdminUserRepository;
import sist.backend.domain.admin.dto.request.StaffAdminRequest;
import sist.backend.domain.admin.dto.request.UpdateStaffPasswordRequest;
import sist.backend.domain.admin.service.service.StaffAdminService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffAdminServiceImpl implements StaffAdminService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<StaffAdminResponse> getAllStaff() {
        return adminUserRepository.findByRoleIn(List.of(UserRole.STAFF, UserRole.ADMIN)).stream()
                .map(StaffAdminResponse::from)
                .collect(Collectors.toList());
    }

    @Override
    public void addStaff(StaffAdminRequest request) {
        // ✅ 1. 아이디 중복 체크
        if (adminUserRepository.existsById(request.getId())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        // ✅ 2. 이메일 중복 체크
        if (adminUserRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }

        // ✅ 3. 기본 역할 설정
        UserRole role = request.getRole() != null ? request.getRole() : UserRole.STAFF;

        User staff = User.builder()
                .id(request.getId())
                .pwd(passwordEncoder.encode(request.getPwd()))
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .status(UserStatus.ACTIVE)
                .role(role)
                .build();

        adminUserRepository.save(staff);
    }

    @Override
    public void updateStaff(Long id, StaffAdminRequest request) {
        User staff = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 직원이 존재하지 않습니다."));

        staff.setName(request.getName());
        staff.setPhone(request.getPhone());
        staff.setEmail(request.getEmail());
        staff.setId(request.getId());

        adminUserRepository.save(staff);
    }

    @Override
    public void resetPassword(Long id) {
        User staff = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 직원이 존재하지 않습니다."));

        staff.setPwd(passwordEncoder.encode("default1234"));
        adminUserRepository.save(staff);
    }

    @Override
    public void deleteStaff(Long id) {
        User staff = adminUserRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 직원이 존재하지 않습니다."));

        if (staff.getRole() != UserRole.STAFF) {
            throw new IllegalStateException("STAFF만 삭제 가능합니다.");
        }

        adminUserRepository.delete(staff);
    }

    @Override

    public void updateStaffStatus(Long userIdx, String status) {
        User staff = adminUserRepository.findById(userIdx)
                .orElseThrow(() -> new IllegalArgumentException("해당 스태프를 찾을 수 없습니다."));

        if (staff.getRole() == UserRole.ADMIN) {
            throw new IllegalStateException("관리자 계정은 상태를 변경할 수 없습니다.");
        }

        UserStatus newStatus = UserStatus.valueOf(status.toUpperCase());
        staff.setStatus(newStatus);
        adminUserRepository.save(staff);
    }

    @Override
    public void changePassword(Long id, UpdateStaffPasswordRequest request) {
        User staff = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("스태프를 찾을 수 없습니다."));

        if (!passwordEncoder.matches(request.getCurrentPassword(), staff.getPassword())) {
            throw new IllegalArgumentException("기존 비밀번호가 일치하지 않습니다.");
        }

        staff.setPwd(passwordEncoder.encode(request.getNewPassword()));
        adminUserRepository.save(staff);
    }

}