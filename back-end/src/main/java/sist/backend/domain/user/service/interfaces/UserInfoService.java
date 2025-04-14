package sist.backend.domain.user.service.interfaces;

import jakarta.servlet.http.HttpServletRequest;
import sist.backend.domain.user.dto.request.UserUpdateRequest;
import sist.backend.domain.user.dto.response.UserResponse;

public interface UserInfoService {

    UserResponse getCurrentUser(HttpServletRequest request);

    UserResponse updateUserInfo(UserUpdateRequest request, HttpServletRequest httpRequest);
}