package sist.backend.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import sist.backend.entity.enums.ActivityType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityLogResponseDto {
    private Long logIdx;
    private Long userIdx;
    private String userName;
    private ActivityType activityType;
    private String activityDetails;
    private String ipAddress;
    private LocalDateTime createdAt;
}