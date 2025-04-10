package sist.backend.domain.admin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TotalUserDailyChangeResponse {
    private long todayTotal;
    private long yesterdayTotal;
    private String changeRate;
}