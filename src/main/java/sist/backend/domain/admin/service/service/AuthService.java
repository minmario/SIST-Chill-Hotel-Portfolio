package sist.backend.domain.admin.service.service;

import sist.backend.domain.admin.dto.request.LoginRequest;
import sist.backend.domain.admin.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
