package sist.backend.domain.admin.entity;

import lombok.*;
import sist.backend.domain.admin.entity.enums.RoomStatus;
import jakarta.persistence.*;

@Entity
@Table(name = "rooms")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_idx")
    private Long id;

    @Column(name = "room_types_idx", nullable = false)
    private Long roomTypeId;

    @Column(name = "room_num", nullable = false, unique = true)
    private String roomNum;

    private int floor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomStatus status;

    @Column(name = "room_image", nullable = false)
    private String roomImage;
}
