package sist.backend.domain.reservation.dto.response;

import lombok.*;
import sist.backend.domain.reservation.entity.Reservation;
import sist.backend.domain.specialoffer.dto.response.SpecialOfferResponse;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {

    private String reservationNum;
    private String fullName; // 예약자 이름
    private String phone;
    private String email;
    private String roomGrade;
    private String roomNumber;
    private Integer roomCount;
    private Integer roomTypeIdx;
    private Integer total;
    private String specialRequests;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int totalNights;
    private int adultCount;
    private int childCount;
    private String status;
    private int totalPrice;
    private SpecialOfferResponse specialOffer;

    public static ReservationResponse fromEntity(Reservation entity) {
        return ReservationResponse.builder()
                .reservationNum(entity.getReservationNum())
                .fullName(entity.getLastName() + entity.getFirstName())
                .phone(entity.getPhone())
                .email(entity.getEmail())
                .roomGrade(entity.getRoomType() != null ? entity.getRoomType().getGrade() : null)
                .roomNumber(entity.getRoom() != null ? entity.getRoom().getRoomNum() : null)
                .roomTypeIdx(entity.getRoomType() != null && entity.getRoomType().getRoomTypesIdx() != null ? entity.getRoomType().getRoomTypesIdx().intValue() : null)
                .total(entity.getTotal())
                .specialRequests(entity.getSpecialRequests())
                .checkInDate(entity.getCheckIn())
                .checkOutDate(entity.getCheckOut())
                .totalNights((int) java.time.temporal.ChronoUnit.DAYS.between(entity.getCheckIn(), entity.getCheckOut()))
                .adultCount(entity.getAdultCount())
                .childCount(entity.getChildCount())
                .status(entity.getStatus() != null ? entity.getStatus().name() : null)
                .totalPrice(entity.getTotal())
                .specialOffer(entity.getSpecialOffer() != null ? SpecialOfferResponse.from(entity.getSpecialOffer()) : null)
                .roomCount(entity.getRoomCount() != null ? entity.getRoomCount().intValue() : 0)
                .build();
    }
}