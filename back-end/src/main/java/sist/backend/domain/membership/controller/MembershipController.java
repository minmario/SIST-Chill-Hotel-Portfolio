package sist.backend.domain.membership.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.membership.dto.response.MembershipResponse;
import sist.backend.domain.membership.service.interfaces.MembershipService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/membership")
public class MembershipController {

    private final MembershipService membershipService;

    @GetMapping
    public List<MembershipResponse> getAllMemberships() {
        return membershipService.getAllMemberships();
    }
}