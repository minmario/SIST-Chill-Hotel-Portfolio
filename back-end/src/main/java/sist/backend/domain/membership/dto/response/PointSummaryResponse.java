package sist.backend.domain.membership.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

public record PointSummaryResponse(
        int totalPoints,
        int availablePoints,
        int expiringPoints,
        String currentTier,
        String nextTier,
        int pointForNextTier) {
}
