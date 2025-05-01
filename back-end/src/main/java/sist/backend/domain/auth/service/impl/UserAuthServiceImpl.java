package sist.backend.domain.auth.service.impl;

import lombok.RequiredArgsConstructor;

import java.time.LocalDate;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import sist.backend.domain.auth.dto.request.PaymentMethodRequest;
import sist.backend.domain.auth.dto.request.UserLoginRequest;
import sist.backend.domain.auth.dto.request.UserRegisterRequest;
import sist.backend.domain.auth.dto.response.UserLoginResponse;
import sist.backend.domain.auth.dto.response.UserRegisterResponse;
import sist.backend.domain.auth.service.service.UserAuthService;
import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.payment.entity.PaymentMethod;
import sist.backend.domain.payment.repository.PaymentMethodRepository;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.domain.user.repository.UserRepository;
import sist.backend.domain.user.service.interfaces.UserActivityLogService;
import sist.backend.global.jwt.JwtProvider;

@Service
@RequiredArgsConstructor
public class UserAuthServiceImpl implements UserAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final UserActivityLogService userActivityLogService;
    private final PaymentMethodRepository paymentMethodRepository;
    private final MembershipRepository membershipRepository;

    @Override
    public UserLoginResponse login(UserLoginRequest request) {
        User user = userRepository.findById(request.getId())
                .orElseThrow(() -> new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다."));

        if (!passwordEncoder.matches(request.getPwd(), user.getPwd())) {
            throw new RuntimeException("아이디 또는 비밀번호가 올바르지 않습니다.");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("비활성화된 계정입니다.");
        }

        if (user.getRole() != UserRole.USER) {
            throw new IllegalArgumentException("일반 사용자만 로그인할 수 있습니다.");
        }

        // 로그인 활동 로그 기록
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        String ipAddress = getClientIp();
        userActivityLogService.logLogin(user, ipAddress);

        // user.getId()를 JWT subject로 사용
        Long membershipIdx = user.getMembership() != null ? user.getMembership().getMembershipIdx() : null;
        String token = jwtProvider.generateToken(
                user.getId(),
                user.getRole().name(),
                membershipIdx);

        return new UserLoginResponse(
                token,
                user.getRole().name(),
                user.getName(), // ✅ 유저 이름
                user.getEmail() // ✅ 유저 이메일
        );
    }

    @Override
    public UserRegisterResponse register(UserRegisterRequest request) {
        // 아이디 중복 확인
        if (userRepository.existsById(request.getId())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("이미 사용 중인 이메일입니다.");
        }
        Membership defaultMembership = membershipRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("기본 멤버십을 찾을 수 없습니다."));

        // 사용자 엔티티 생성
        User user = User.builder()
                .id(request.getId())
                .pwd(passwordEncoder.encode(request.getPwd()))
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .status(UserStatus.ACTIVE)
                .role(UserRole.USER)
                .totalPoints(0)
                .totalStays(0)
                .membership(defaultMembership)
                .build();

        // 사용자 저장
        userRepository.save(user);

        // JWT 토큰 생성
        Long membershipIdx = user.getMembership() != null ? user.getMembership().getMembershipIdx() : null;

        String token = jwtProvider.generateToken(
                user.getId(),
                user.getRole().name(),
                membershipIdx);
        // 사용자 저장 후 결제 수단 등록
        if (request.getPaymentMethod() != null) {
            PaymentMethodRequest pm = request.getPaymentMethod();

            String lastFour = pm.getCardNumber().replaceAll("\\s", "");
            lastFour = lastFour.substring(lastFour.length() - 4);

            PaymentMethod paymentMethod = PaymentMethod.builder()
                    .user(user)
                    .cardType(pm.getCardCompany())
                    .lastFourDigits(lastFour)
                    .ownerName(pm.getCardHolder())
                    .expireDate(LocalDate.parse(
                            "20" + pm.getCardExpiry().substring(3) + "-" + pm.getCardExpiry().substring(0, 2) + "-01"))
                    .token("TEMP_TOKEN")
                    .build();

            paymentMethodRepository.save(paymentMethod);
        }

        // 응답 반환
        return UserRegisterResponse.builder()
                .message("회원가입이 완료되었습니다.")
                .token(token)
                .role(user.getRole().name())
                .build();
    }

    // 클라이언트 IP 주소 가져오기
    private String getClientIp() {
        String ipAddress = "0.0.0.0"; // 기본값
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                ipAddress = getIpFromRequest(request);
            }
        } catch (Exception e) {
            // IP 주소를 가져오는 중 오류가 발생하면 기본값 사용
        }
        return ipAddress;
    }

    // 요청에서 실제 IP 주소 추출
    private String getIpFromRequest(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");

        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("WL-Proxy-Client-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_CLIENT_IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("HTTP_X_FORWARDED_FOR");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }

        // 쉼표로 구분된 여러 IP가 있을 경우 첫 번째 IP 사용
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }

        return ip;
    }
}
