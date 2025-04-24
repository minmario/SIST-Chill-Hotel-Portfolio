package sist.backend.domain.membership.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.membership.service.interfaces.MembershipUpdaterService;
import sist.backend.domain.user.entity.User;
import sist.backend.domain.user.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipUpdaterServiceImpl implements MembershipUpdaterService {

    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;

    /**
     * 포인트와 숙박 조건을 모두 충족하는 최고 등급으로 갱신
     */
    @Transactional
    public void updateUserMembershipIfNeeded(User user) {
        List<Membership> levels = membershipRepository.findAllByOrderByRequiredPointAsc();

        Membership current = user.getMembership();
        Membership bestMatched = null;

        for (Membership level : levels) {
            if (user.getTotalPoints() >= level.getRequiredPoint()
                    && user.getTotalStays() >= level.getRequiredStays()) {
                bestMatched = level; // AND 조건 만족하는 최고 등급
            }
        }

        if (bestMatched != null && (current == null || !current.equals(bestMatched))) {
            user.setMembership(bestMatched);
            userRepository.save(user);
        }
    }
}
