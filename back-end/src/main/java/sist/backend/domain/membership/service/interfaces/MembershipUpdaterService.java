package sist.backend.domain.membership.service.interfaces;

import sist.backend.domain.user.entity.User;

public interface MembershipUpdaterService {
    public void updateUserMembershipIfNeeded(User user);

}
