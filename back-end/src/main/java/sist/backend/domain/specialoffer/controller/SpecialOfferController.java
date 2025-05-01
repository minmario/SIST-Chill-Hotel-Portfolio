package sist.backend.domain.specialoffer.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import sist.backend.domain.specialoffer.dto.response.SpecialOfferResponse;
import sist.backend.domain.specialoffer.service.SpecialOfferService;

import java.util.stream.Collectors;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/special-offers")
public class SpecialOfferController {
    private final SpecialOfferService specialOfferService;

    @GetMapping
    //@PreAuthorize("isAuthenticated()") // JWT 인증 필요시 활성화
    public ResponseEntity<List<SpecialOfferResponse>> getAllSpecialOffers() {
        List<SpecialOfferResponse> offers = specialOfferService.getAllSpecialOffers()
                .stream()
                .map(SpecialOfferResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(offers);
    }
}
