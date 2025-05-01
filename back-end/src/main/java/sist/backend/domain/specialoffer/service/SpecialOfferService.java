package sist.backend.domain.specialoffer.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sist.backend.domain.specialoffer.entity.SpecialOffer;
import sist.backend.domain.specialoffer.repository.SpecialOfferRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SpecialOfferService {
    private final SpecialOfferRepository specialOfferRepository;

    public List<SpecialOffer> getAllSpecialOffers() {
        return specialOfferRepository.findAll();
    }
}
