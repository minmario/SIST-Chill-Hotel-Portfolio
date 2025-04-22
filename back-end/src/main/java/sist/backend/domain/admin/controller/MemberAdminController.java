package sist.backend.domain.admin.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.admin.dto.request.UpdateStatusRequest;
import sist.backend.domain.admin.dto.response.MemberResponse;
import sist.backend.domain.admin.service.service.MemberService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/members")
public class MemberAdminController {

    private final MemberService memberService;

    @GetMapping
    public List<MemberResponse> getAllMembers() {
        return memberService.getAllMembers();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateUserStatus(@PathVariable String id, @RequestBody UpdateStatusRequest dto) {
        memberService.updateUserStatus(id, dto.getStatus());
        return ResponseEntity.ok().build();
    }

}