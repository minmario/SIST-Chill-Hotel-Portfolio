package sist.backend.domain.auth.service.service;

import sist.backend.domain.auth.dto.request.UserLoginRequest;
import sist.backend.domain.auth.dto.response.UserLoginResponse;

public interface UserAuthService {
    UserLoginResponse login(UserLoginRequest request);
}
