package sist.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import sist.backend.entity.reservation.ReservationEntity;

import java.time.LocalDate;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    private Long id;
    private String name;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String status;

    public ReservationResponse(ReservationEntity entity) {
    this.id = entity.getId();
    this.name = entity.getName();
    this.checkInDate = entity.getCheckInDate();
    this.checkOutDate = entity.getCheckOutDate();
    this.status = entity.getStatus().name();
    }
}