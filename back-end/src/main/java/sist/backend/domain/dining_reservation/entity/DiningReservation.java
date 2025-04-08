package sist.backend.domain.dining_reservation.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "dining_reservation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiningReservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_num", nullable = false, unique = true, length = 20)
    private String reservationNum;

    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @Column(name = "reservation_date", nullable = false)
    private LocalDate reservationDate;

    @Column(name = "meal_time", length = 10)
    private String mealTime;

    @Column(name = "reservation_time", length = 10)
    private String reservationTime;

    private int adults;
    private int children;

    @Column(name = "first_name", length = 50)
    private String firstName;

    @Column(name = "last_name", length = 50)
    private String lastName;

    @Column(length = 20)
    private String phone;

    @Email
    @Column(length = 100)
    private String email;

    @Size(max = 300)
    private String request;

    @Column(length = 20)
    private String status = "PENDING";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}