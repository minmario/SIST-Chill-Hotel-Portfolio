package sist.backend.domain.room.dto.response;

import java.math.BigDecimal;
import java.util.List;

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
    private Integer size;
    private String viewType;
    private Integer maxPeople;
    private String description;
    private String roomImage;
    private BigDecimal weekPrice;
    private BigDecimal weekendPrice;
    private BigDecimal peakWeekPrice;
    private BigDecimal peakWeekendPrice;
    private Integer totalCount;
    private Integer availableCount; 
    private List<Long> availableRoomIdxList;

    public static RoomTypeResponse fromEntity(RoomType roomType, List<Long> availableRoomIdxList) {
        return RoomTypeResponse.builder()
                .roomTypesIdx(roomType.getRoomTypesIdx())
                .roomName(roomType.getRoomName())
                .grade(roomType.getGrade())
                .size(roomType.getSize())
                .viewType(roomType.getViewType())
                .maxPeople(roomType.getMaxPeople())
                .description(roomType.getDescription())
                .roomImage(roomType.getRoomImage())
                .weekPrice(roomType.getWeekPrice())
                .weekendPrice(roomType.getWeekendPrice())
                .peakWeekPrice(roomType.getPeakWeekPrice())
                .peakWeekendPrice(roomType.getPeakWeekendPrice())
                .totalCount(roomType.getTotalCount())
                .availableCount(availableRoomIdxList.size()) 
                .availableRoomIdxList(availableRoomIdxList)
                .build();
    }
}