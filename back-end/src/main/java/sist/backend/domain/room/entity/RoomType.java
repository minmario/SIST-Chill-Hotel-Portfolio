package sist.backend.domain.room.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_types")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_types_idx")
    private Long roomTypesIdx;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @Column(nullable = false)
    private String grade;

    @Column(nullable = false)
    private String size;

    @Column(name = "view_type", nullable = false)
    private String viewType;

    @Column(name = "max_people", nullable = false)
    private int maxPeople;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "week_price", nullable = false)
    private int weekPrice;

    @Column(name = "weekend_price", nullable = false)
    private int weekendPrice;

    @Column(name = "peak_week_price", nullable = false)
    private int peakWeekPrice;

    @Column(name = "peak_weekend_price", nullable = false)
    private int peakWeekendPrice;

    @Column(name = "total_count", nullable = false)
    private int totalCount;
    @OneToMany(mappedBy = "roomType")
    private List<Room> rooms;

    public List<Room> getRooms() {
        return rooms;
    }
}