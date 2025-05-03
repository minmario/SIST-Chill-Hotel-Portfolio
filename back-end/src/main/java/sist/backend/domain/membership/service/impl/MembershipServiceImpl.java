package sist.backend.domain.membership.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.membership.dto.response.MembershipResponse;
import sist.backend.domain.membership.entity.Membership;
import sist.backend.domain.membership.repository.MembershipRepository;
import sist.backend.domain.membership.service.interfaces.MembershipService;

@Service
@RequiredArgsConstructor
public class MembershipServiceImpl implements MembershipService {

    private final MembershipRepository membershipRepository;

    @Override
    public List<MembershipResponse> getAllMemberships() {
        return membershipRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private MembershipResponse toDto(Membership m) {
        return MembershipResponse.builder()
                .tier(m.getTier().toString())
                .requiredPoint(m.getRequiredPoint())
                .requiredStays(m.getRequiredStays())
                .membershipNumber(m.getMembershipNumber())
                .savePercent(m.getSavePercent())
                .build();
    }
}
