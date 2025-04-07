package sist.backend.domain.reservation.dto.request;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequestDTO {
    private Boolean isGuest;
    private Long userId;
    private String guestName;
    private String guestPhone;
    private String guestEmail;
    private Long roomId;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private Integer adultBreakfastCount;
    private Integer childBreakfastCount;
    private String specialRequest;
}
