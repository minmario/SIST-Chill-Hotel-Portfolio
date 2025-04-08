package sist.backend.domain.restaurant.entity;

import java.time.LocalTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sist.backend.global.common.BaseTimeEntity;

@Entity
@Table(name = "restaurants")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Restaurant extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long restaurantsIdx;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private Integer capacity;

    @Column(nullable = false)
    private LocalTime open;

    @Column(nullable = false)
    private LocalTime close;

    @Column(nullable = false)
    private String location;

    // 비즈니스 메서드
    public void updateHours(LocalTime open, LocalTime close) {
        this.open = open;
        this.close = close;
    }

    public void updateCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public boolean isOpenAt(LocalTime time) {
        return !time.isBefore(open) && !time.isAfter(close);
    }
}
