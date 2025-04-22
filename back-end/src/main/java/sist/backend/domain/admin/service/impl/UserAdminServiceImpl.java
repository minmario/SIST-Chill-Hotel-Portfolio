package sist.backend.domain.admin.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.request.UserRegisterRequest;
import sist.backend.domain.admin.dto.response.UserDailyChangeResponse;
import sist.backend.domain.admin.dto.response.UserResponse;
import sist.backend.domain.admin.repository.AdminUserRepository;
import sist.backend.domain.admin.service.service.UserAdminService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.domain.admin.dto.response.TotalUserDailyChangeResponse;

@Service
@RequiredArgsConstructor
public class UserAdminServiceImpl implements UserAdminService {

    private final AdminUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void registerStaff(UserRegisterRequest request) {
        if (userRepository.existsById(request.getId())) {
            throw new RuntimeException("아이디 중복");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이메일 중복");
        }

        User user = User.builder()
                .id(request.getId())
                .email(request.getEmail())
                .pwd(passwordEncoder.encode(request.getPwd()))
                .name(request.getName())
                .phone(request.getPhone())
                .role(UserRole.STAFF)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
    }

    @Override
    public Long getTotalUserCount() {
        return userRepository.count();
    }

    /** 최근 가입자 목록 조회 (최근 7일 이내) */
    @Override
    public List<UserResponse> getRecentUsers() {
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        
        
        return userRepository.findByRoleAndCreatedAtAfterOrderByCreatedAtDesc(UserRole.USER, sevenDaysAgo)
                .stream()
                .map(UserResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /** 스태프 수 조회 (role = 'staff') */
    @Override
    public Long getStaffCount() {
        return userRepository.countByRole(UserRole.STAFF);
    }

    /** 일일 사용자 변화율 조회 */
    @Override
    public UserDailyChangeResponse getDailyUserChange() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = startOfToday;

        long todayCount = userRepository.countByCreatedAtBetween(startOfToday, LocalDateTime.now());
        long yesterdayCount = userRepository.countByCreatedAtBetween(startOfYesterday, endOfYesterday);

        double rate = 0.0;
        if (yesterdayCount > 0) {
            rate = ((double) (todayCount - yesterdayCount) / yesterdayCount) * 100;
        }

        String rateStr = (rate > 0 ? "+" : "") + String.format("%.0f", rate) + "%";

        return UserDailyChangeResponse.builder()
                .today(todayCount)
                .yesterday(yesterdayCount)
                .changeRate(rateStr)
                .build();
    }

    /** 일일 총사용자 변화율 조회 */
    @Override
    public TotalUserDailyChangeResponse getDailyTotalUserChange() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        // 오늘 00:00 기준 시간
        LocalDateTime startOfToday = today.atStartOfDay();

        // 전체 누적 회원 수 (현재 시점 기준)
        long todayTotal = userRepository.count();

        // 어제 23:59:59까지의 누적 회원 수 = createdAt < startOfToday
        long yesterdayTotal = userRepository.countByCreatedAtBefore(startOfToday);

        double rate = 0.0;
        if (yesterdayTotal > 0) {
            rate = ((double) (todayTotal - yesterdayTotal) / yesterdayTotal) * 100;
        }

        String rateStr = (rate > 0 ? "+" : "") + String.format("%.0f", rate) + "%";

        return TotalUserDailyChangeResponse.builder()
                .todayTotal(todayTotal)
                .yesterdayTotal(yesterdayTotal)
                .changeRate(rateStr)
                .build();
    }

    /** 일일 스태프 변화율 조회 */
    @Override
    public UserDailyChangeResponse getDailyNewStaffChange() {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);

        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = startOfToday;

        long todayCount = userRepository.countByRoleAndCreatedAtBetween(UserRole.STAFF, startOfToday,
                LocalDateTime.now());
        long yesterdayCount = userRepository.countByRoleAndCreatedAtBetween(UserRole.STAFF, startOfYesterday,
                endOfYesterday);

        double rate = 0.0;
        if (yesterdayCount > 0) {
            rate = ((double) (todayCount - yesterdayCount) / yesterdayCount) * 100;
        }

        String rateStr = (rate > 0 ? "+" : "") + String.format("%.0f", rate) + "%";

        return UserDailyChangeResponse.builder()
                .today(todayCount)
                .yesterday(yesterdayCount)
                .changeRate(rateStr)
                .build();
    }

}