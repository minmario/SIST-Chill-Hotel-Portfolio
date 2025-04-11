package sist.backend.domain.auth.service.service;

import sist.backend.domain.auth.dto.request.UserLoginRequest;
import sist.backend.domain.auth.dto.request.UserRegisterRequest;
import sist.backend.domain.auth.dto.response.UserLoginResponse;
import sist.backend.domain.auth.dto.response.UserRegisterResponse;

public interface UserAuthService {
    UserLoginResponse login(UserLoginRequest request);
    UserRegisterResponse register(UserRegisterRequest request);
}
