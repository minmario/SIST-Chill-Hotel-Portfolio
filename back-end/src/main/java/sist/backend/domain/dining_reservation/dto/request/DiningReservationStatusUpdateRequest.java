package sist.backend.domain.dining_reservation.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiningReservationStatusUpdateRequest {
    @NotBlank
    private String status;
}
