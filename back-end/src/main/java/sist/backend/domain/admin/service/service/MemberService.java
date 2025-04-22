package sist.backend.domain.admin.service.service;

import java.util.List;

import sist.backend.domain.admin.dto.response.MemberResponse;

public interface MemberService {
    public List<MemberResponse> getAllMembers();

    void updateUserStatus(String userId, String status);

}
