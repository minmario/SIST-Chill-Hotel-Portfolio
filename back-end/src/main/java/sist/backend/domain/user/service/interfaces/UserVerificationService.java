package sist.backend.domain.user.service.interfaces;

import jakarta.servlet.http.HttpServletRequest;

public interface UserVerificationService {
    boolean verifyCurrentUserPassword(String password, HttpServletRequest request);

    void withdrawCurrentUser(HttpServletRequest request);
}