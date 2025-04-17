package sist.backend.domain.dining_admin.dto;

import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.dining_reservation.entity.DiningReservation;

@Getter
@Builder
public class AdminDiningReservationResponse {
    private String id; // reservationNum (String으로 수정 완료)
    private Long restaurantId;
    private String guestName;
    private String date;
    private String time;
    private int partySize;
    private String status;
    private String contact;
    private String email;
    private String specialRequests;
    private String roomNumber; // Entity에는 없으므로 null
    private boolean isHotelGuest; // Entity에 없으므로 false 고정
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static AdminDiningReservationResponse fromEntity(DiningReservation r) {
        return AdminDiningReservationResponse.builder()
                .id(r.getReservationNum()) // String 반환
                .restaurantId(r.getRestaurantId())
                .guestName((r.getLastName() + r.getFirstName()).trim())
                .date(r.getReservationDate().toString())
                .time(r.getReservationTime().toString().substring(0, 5)) // HH:mm
                .partySize(r.getAdults() + r.getChildren())
                .status(r.getStatus().toLowerCase())
                .contact(r.getPhone())
                .email(r.getEmail())
                .specialRequests(r.getRequest())
                .roomNumber(null)
                .isHotelGuest(false)
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}
