package sist.backend.domain.reservation.dto.request;

import java.util.List;

import lombok.*;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationRequest {

  // 예약 상태 (초기 생성 시에는 생략하거나 기본값 처리 예정)
  private String status;

  // 스페셜오퍼 ID(선택)
  private Long offerId;

  // 사용자 및 객실 정보
  private Long userIdx;
  private List<Long> roomIdxList;
  private Long roomTypesIdx;

  // 예약 정보
  private String reservationNum;
  private String checkIn;
  private String checkOut;
  private int roomCount;
  private int adultCount;
  private int childCount;
  private String bedType;
  private String specialRequests;

  // 금액 정보
  private int roomPrice;
  private int adultBreakfastPrice;
  private int childBreakfastPrice;
  private int subtotal;
  private int discount;
  private int total;

  // 고객 정보
  private String firstName;
  private String lastName;
  private String email;
  private String phone;

  // 결제 정보
  private String cardNumber;
  private String cardExpiry;
}
