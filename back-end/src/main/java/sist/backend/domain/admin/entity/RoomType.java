package sist.backend.domain.admin.entity;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "room_types")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomType {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_types_idx")
    private Long id;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    private String grade;

    private int size;

    @Column(name = "view_type")
    private String viewType;

    @Column(name = "max_adult")
    private int maxAdult;

    @Column(name = "max_children")
    private int maxChildren;

    private String description;

    @Column(name = "week_price")
    private BigDecimal weekPrice;

    @Column(name = "weekend_price")
    private BigDecimal weekendPrice;

    @Column(name = "peak_week_price")
    private BigDecimal peakWeekPrice;

    @Column(name = "peak_weekend_price")
    private BigDecimal peakWeekendPrice;

    @Column(name = "total_count")
    private int totalCount;
}
