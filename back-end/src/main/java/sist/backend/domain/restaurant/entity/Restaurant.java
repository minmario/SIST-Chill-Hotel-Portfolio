package sist.backend.domain.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "restaurants_idx")
    private Long restaurantsIdx;

    private String name;
    private String location;
    private Integer capacity;
    private String type;
    private String description;
    private String image;
    private LocalTime open;
    private LocalTime close;

    @Column(name = "price_adult")
    private Integer priceAdult;

    @Column(name = "price_child")
    private Integer priceChild;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "breakfast_open")
    private LocalTime breakfastOpen;

    @Column(name = "breakfast_close")
    private LocalTime breakfastClose;

    @Column(name = "lunch_open")
    private LocalTime lunchOpen;

    @Column(name = "lunch_close")
    private LocalTime lunchClose;

    @Column(name = "dinner_open")
    private LocalTime dinnerOpen;

    @Column(name = "dinner_close")
    private LocalTime dinnerClose;
}
