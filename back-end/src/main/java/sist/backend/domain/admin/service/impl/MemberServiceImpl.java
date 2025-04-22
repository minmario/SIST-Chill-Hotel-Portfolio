package sist.backend.domain.admin.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.response.MemberResponse;
import sist.backend.domain.admin.service.service.MemberService;
import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.membership.repository.PointTransactionRepository;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.entity.UserRole;
import sist.backend.domain.user.entity.UserStatus;
import sist.backend.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final UserRepository userRepository;
    private final PointTransactionRepository pointTransactionRepository;
    private final MembershipRepository membershipRepository;

    public List<MemberResponse> getAllMembers() {
        return userRepository.findAll().stream().map(user -> {
            int totalPoints = pointTransactionRepository.findTotalPointByUserIdx(user.getUserIdx());
            String tier = calculateTierFromDB(totalPoints);

            return MemberResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .createdAt(user.getCreatedAt()) //
                    .updatedAt(user.getUpdatedAt()) //
                    .status(user.getStatus().name().toLowerCase())
                    .membershipLevel(tier)
                    .points(totalPoints)
                    .role(user.getRole() != null ? user.getRole().name() : null)
                    .build();
        }).toList();
    }

    private String calculateTierFromDB(int point) {
        List<Membership> candidates = membershipRepository.findAvailableTiersByPoint(point);
        return candidates.isEmpty() ? "BRONZE" : candidates.get(0).getTier().name();
    }

    @Override
    @Transactional
    public void updateUserStatus(String userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저를 찾을 수 없습니다."));

        if (user.getRole() == UserRole.ADMIN) {
            throw new IllegalStateException("관리자 계정은 상태를 변경할 수 없습니다.");
        }

        UserStatus newStatus = UserStatus.valueOf(status.toUpperCase());
        user.setStatus(newStatus);
        userRepository.save(user);
    }
}