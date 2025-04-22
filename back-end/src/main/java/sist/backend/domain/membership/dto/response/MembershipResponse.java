package sist.backend.domain.membership.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipResponse {
    private String tier;
    private int requiredPoint;
    private int requiredStays;
    private String membershipNumber;
    private int savePercent;
}