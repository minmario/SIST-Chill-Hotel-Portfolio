package sist.backend.domain.membership.service.interfaces;

import java.util.List;

import sist.backend.domain.membership.dto.MemberResponse;

public interface MemberService {
    public List<MemberResponse> getAllMembers();

}
