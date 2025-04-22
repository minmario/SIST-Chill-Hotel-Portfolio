package sist.backend.domain.reservation.dto.response;

public record StaySummaryResponse(
        double totalStay, // 최근 1년 숙박일 수
        double stayForNextTier, // 다음 등급까지 남은 숙박일 수
        String currentTier, // 현재 등급
        String nextTier // 다음 등급
) {
}