package sist.backend.domain.admin.service.service;

import java.util.List;

import sist.backend.domain.admin.dto.request.UserRegisterRequest;
import sist.backend.domain.admin.dto.response.TotalUserDailyChangeResponse;
import sist.backend.domain.admin.dto.response.UserDailyChangeResponse;
import sist.backend.domain.admin.dto.response.UserResponse;

public interface UserAdminService {
    void registerStaff(UserRegisterRequest request);

    /** 전체 회원 수 조회 */
    Long getTotalUserCount();

    /** 최근 가입자 목록 조회 */
    List<UserResponse> getRecentUsers();

    /** 스태프 수 조회 */
    Long getStaffCount();

    UserDailyChangeResponse getDailyUserChange();

    TotalUserDailyChangeResponse getDailyTotalUserChange();

    UserDailyChangeResponse getDailyNewStaffChange();

}
