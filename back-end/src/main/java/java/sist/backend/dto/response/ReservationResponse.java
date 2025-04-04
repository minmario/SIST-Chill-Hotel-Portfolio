package java.sist.backend.dto.response;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Getter
@Setter
public class ReservationResponse {
    private Long id;
    private String name;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String status;
}