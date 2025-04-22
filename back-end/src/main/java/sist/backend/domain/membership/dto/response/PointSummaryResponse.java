package sist.backend.domain.membership.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class PointSummaryResponse {
    private Integer totalPoints;
    private Integer availablePoints;
    private Integer expiringPoints;

}
