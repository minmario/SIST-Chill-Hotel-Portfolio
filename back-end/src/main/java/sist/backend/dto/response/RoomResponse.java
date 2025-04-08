package sist.backend.dto.response;

import lombok.*;
import sist.backend.domain.room.entity.Room;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long roomIdx;
    private Long roomTypesIdx;
    private String roomNum;
    private int floor;
    private String status;
    private String roomImage;

    public static RoomResponse fromEntity(Room room) {
        return RoomResponse.builder()
                .roomIdx(room.getRoomIdx())
                .roomTypesIdx(room.getRoomTypesIdx())
                .roomNum(room.getRoomNum())
                .floor(room.getFloor())
                .status(room.getStatus())
                .roomImage(room.getRoomImage())
                .build();
    }

}