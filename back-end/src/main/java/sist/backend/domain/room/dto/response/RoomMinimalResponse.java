package sist.backend.domain.room.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RoomMinimalResponse {
    private Long roomIdx;
    private String roomNum;
    private Long roomTypeIdx;
}