package sist.backend.domain.membership.dto.response;


public record PointSummaryResponse(
        int totalPoints,
        int availablePoints,
        int expiringPoints,
        String currentTier,
        String nextTier,
        int pointForNextTier) {
}
