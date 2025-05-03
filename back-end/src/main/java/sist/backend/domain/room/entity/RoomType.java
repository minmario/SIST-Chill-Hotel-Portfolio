package sist.backend.domain.room.entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "room_types")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class RoomType  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomTypesIdx;

    @Column(nullable = false, length = 100)
    private String roomName;

    @Column(nullable = false, length = 50)
    private String grade;

    @Column(nullable = false)
    private Integer size;

    @Column(nullable = false, length = 50)
    private String viewType;

    @Column(nullable = false)
    private Integer maxPeople;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weekPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal weekendPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal peakWeekPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal peakWeekendPrice;

    @Column(nullable = false)
    private Integer totalCount;

    @Column(nullable = false, length = 100)
    private String roomImage;

    @Builder.Default
    @OneToMany(mappedBy = "roomType",fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Room> rooms = new ArrayList<>();

    // 비즈니스 메서드
    public void updatePrices(BigDecimal weekPrice, BigDecimal weekendPrice,
            BigDecimal peakWeekPrice, BigDecimal peakWeekendPrice) {
        this.weekPrice = weekPrice;
        this.weekendPrice = weekendPrice;
        this.peakWeekPrice = peakWeekPrice;
        this.peakWeekendPrice = peakWeekendPrice;
    }

    public void updateCapacity(Integer maxPeople) {
        this.maxPeople = maxPeople;
    }

    public void updateDescription(String description) {
        this.description = description;
    }

    public void addRoom(Room room) {
        rooms.add(room);
        room.setRoomType(this);
    }
    
    public void updateRoomImage(String roomImage) {
        this.roomImage = roomImage;
    }
}
