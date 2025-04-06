// Reservation 엔티티
package sist.backend.entity.reservation;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import sist.backend.entity.enums.ReservationStatus;
import java.time.LocalDate;

@Entity
@Table(name = "reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReservationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @Column(name = "room_type", nullable = false)
    private String roomType;

    @Column(name = "number_of_guests", nullable = false)
    private int numberOfGuests;

    @Column(name = "adults", nullable = false)
    private int adults;

    @Column(nullable = false)
    private int price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @Column(name = "reservation_num", nullable = false, unique = true)
    private String reservationNum;

    @Column(name = "user_idx", nullable = false)
    private Long userIdx;

    public ReservationEntity(String name, String email, String phone, LocalDate checkInDate, LocalDate checkOutDate, String roomType, int numberOfGuests, int adults, int price, ReservationStatus status) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.roomType = roomType;
        this.numberOfGuests = numberOfGuests;
        this.adults = adults;
        this.price = price;
        this.status = status;
    }
}
