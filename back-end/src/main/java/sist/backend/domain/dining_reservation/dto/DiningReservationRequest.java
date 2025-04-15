package sist.backend.domain.dining_reservation.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DiningReservationRequest {

    @NotNull
    private Long restaurantId;

    @NotNull
    private LocalDate reservationDate;

    @NotBlank
    private String mealTime;

    @NotBlank
    private String reservationTime;

    @Min(1)
    @Max(5)
    private int adults;

    @Min(0)
    @Max(5)
    private int children;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String phone;

    @Email
    private String email;

    @Size(max = 300)
    private String request;
}
