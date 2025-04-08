package sist.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import sist.backend.domain.room.entity.RoomType;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoomTypeResponse {
    private Long roomTypesIdx;
    private String roomName;
    private String grade;
    private String size;
    private String viewType;
    private int maxAdult;
    private int maxChildren;
    private String description;
    private int weekPrice;
    private int weekendPrice;
    private int peakWeekPrice;
    private int peakWeekendPrice;
    private int totalCount;
    private int availableCount; 

    public static RoomTypeResponse fromEntity(RoomType roomType) {
        return RoomTypeResponse.builder()
                .roomTypesIdx(roomType.getRoomTypesIdx())
                .roomName(roomType.getRoomName())
                .grade(roomType.getGrade())
                .size(roomType.getSize())
                .viewType(roomType.getViewType())
                .maxAdult(roomType.getMaxPeople())
                .description(roomType.getDescription())
                .weekPrice(roomType.getWeekPrice())
                .weekendPrice(roomType.getWeekendPrice())
                .peakWeekPrice(roomType.getPeakWeekPrice())
                .peakWeekendPrice(roomType.getPeakWeekendPrice())
                .totalCount(roomType.getTotalCount())
                .availableCount(0) 
                .build();
    }
}