package sist.backend.domain.specialoffer;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.specialoffer.entity.SpecialOffer;

public interface SpecialOfferRepository extends JpaRepository<SpecialOffer, Long> {
}
