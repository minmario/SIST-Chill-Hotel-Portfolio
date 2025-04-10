package sist.backend.domain.room.dto.response;

import lombok.*;
import sist.backend.domain.room.entity.Room;
import sist.backend.domain.room.entity.RoomStatus;
import sist.backend.domain.room.entity.RoomType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long roomIdx;
    private RoomType roomType;
    private String roomNum;
    private int floor;
    private RoomStatus status;
    private String roomImage;

    public static RoomResponse fromEntity(Room room) {
        return RoomResponse.builder()
                .roomIdx(room.getRoomIdx())
                .roomType(room.getRoomType())
                .roomNum(room.getRoomNum())
                .floor(room.getFloor())
                .status(room.getStatus())
                .build();
    }

}