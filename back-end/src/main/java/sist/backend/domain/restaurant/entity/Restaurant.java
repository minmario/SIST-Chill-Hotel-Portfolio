package sist.backend.domain.restaurant.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalTime;
import java.time.LocalDateTime;

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

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 255)
    private String type;

    @Column(length = 255)
    private String description;

    @Column(length = 255)
    private String image;

    @Column(length = 255)
    private String location;

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

    @Column
    private LocalTime open;

    @Column
    private LocalTime close;

    @Column(name = "price_adult")
    private Integer priceAdult;

    @Column(name = "price_child")
    private Integer priceChild;

    @Column
    private Integer capacity;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
