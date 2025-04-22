package sist.backend.domain.membership.service.interfaces;

import java.util.List;
import sist.backend.domain.membership.dto.response.MembershipResponse;

public interface MembershipService {
    List<MembershipResponse> getAllMemberships();
}