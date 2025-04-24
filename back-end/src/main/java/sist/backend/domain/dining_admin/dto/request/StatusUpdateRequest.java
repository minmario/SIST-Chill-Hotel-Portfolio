package sist.backend.domain.dining_admin.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatusUpdateRequest {
    private String reservationNum;
    private String status;
}
