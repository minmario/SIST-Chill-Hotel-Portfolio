package sist.backend.domain.admin.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sist.backend.domain.admin.dto.response.StaffAdminResponse;
import sist.backend.domain.admin.repository.AdminUserRepository;
import sist.backend.domain.admin.dto.request.StaffAdminRequest;
import sist.backend.domain.admin.service.service.StaffAdminService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.domain.user.repository.UserRepository;

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
        // ✅ null일 경우 STAFF로 기본값 지정
        UserRole role = request.getRole() != null ? request.getRole() : UserRole.STAFF;

    User staff = User.builder()
            .id(request.getId())
                .pwd(passwordEncoder.encode(request.getPwd()))
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .status(UserStatus.ACTIVE)
                .role(role) // ✅ 동적 적용
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
}