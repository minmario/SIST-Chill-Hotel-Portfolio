package sist.backend.domain.specialoffer.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sist.backend.domain.specialoffer.entity.SpecialOffer;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialOfferResponse {
    private Long id;
    private String title;
    private String subtitle;
    private String image;
    private java.time.LocalDate startDate;
    private java.time.LocalDate endDate;
    private String price;
    private String intro;
    private Long roomIdx;

    public static SpecialOfferResponse from(SpecialOffer offer) {
        return SpecialOfferResponse.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .subtitle(offer.getSubtitle())
                .image(offer.getImage())
                .startDate(offer.getStartDate())
                .endDate(offer.getEndDate())
                .price(offer.getPrice())
                .intro(offer.getIntro())
                .roomIdx(offer.getRoomIdx())
                .build();
    }
}
