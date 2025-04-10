// REST API 컨트롤러임을 나타내는 어노테이션. 반환값은 기본적으로 JSON 형식.
package sist.backend.domain.admin.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.request.UserRegisterRequest;
import sist.backend.domain.admin.dto.request.UserRequest;
import sist.backend.domain.admin.dto.response.UserResponse;
import sist.backend.domain.admin.service.UserService;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register-staff")
    public ResponseEntity<String> registerStaff(@RequestBody UserRegisterRequest request) {
        userService.registerStaff(request);
        return ResponseEntity.ok("관리자 계정이 등록되었습니다.");
    }
}