package sist.backend.domain.admin.service.service;

import sist.backend.domain.admin.dto.request.UserRegisterRequest;

public interface UserService {
    void registerStaff(UserRegisterRequest request);

}
