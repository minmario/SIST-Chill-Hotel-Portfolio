package sist.backend.domain.membership.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.membership.dto.MemberResponse;
import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.membership.repository.PointTransactionRepository;
import sist.backend.domain.membership.service.interfaces.MemberService;

import sist.backend.domain.user.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class MemberServiceImpl implements MemberService {

    private final UserRepository userRepository;
    private final PointTransactionRepository pointTransactionRepository;
    private final MembershipRepository membershipRepository;

    public List<MemberResponse> getAllMembers() {
        return userRepository.findAll().stream().map(user -> {
            int totalPoints = pointTransactionRepository.sumPointsByUserId(user.getUserIdx());
            String tier = calculateTierFromDB(totalPoints);

            return MemberResponse.builder()
                    .id(user.getId())
                    .name(user.getName())
                    .email(user.getEmail())
                    .phone(user.getPhone())
                    .createdAt(user.getCreatedAt()) // ✅ 추가
                    .updatedAt(user.getUpdatedAt()) // ✅ 추가
                    .status(user.getStatus().name().toLowerCase())
                    .membershipLevel(tier)
                    .points(totalPoints)
                    .build();
        }).toList();
    }

    private String calculateTierFromDB(int point) {
        List<Membership> candidates = membershipRepository.findAvailableTiersByPoint(point);
        return candidates.isEmpty() ? "BROWN" : candidates.get(0).getTier().name();
    }
}