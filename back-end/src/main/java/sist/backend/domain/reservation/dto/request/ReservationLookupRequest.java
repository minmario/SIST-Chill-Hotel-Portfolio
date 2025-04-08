package sist.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationLookupRequest {
    private String name;
    private String email;
    private String phone;
}