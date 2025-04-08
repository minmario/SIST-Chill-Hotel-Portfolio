package sist.backend.domain.room.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_idx")
    private Long roomIdx;

    @Column(name = "room_types_idx", nullable = false)
    private Long roomTypesIdx;

    @Column(name = "room_num", nullable = false, unique = true)
    private String roomNum;

    @Column(name = "floor", nullable = false)
    private int floor;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "room_image")
    private String roomImage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_types_idx", insertable = false, updatable = false)
    private RoomType roomType;
}