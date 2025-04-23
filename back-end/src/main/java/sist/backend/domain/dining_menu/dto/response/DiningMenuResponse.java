package sist.backend.domain.dining_menu.dto.response;

import lombok.Builder;
import lombok.Getter;
import sist.backend.domain.dining_menu.entity.DiningMenu;

@Getter
@Builder
public class DiningMenuResponse {
    private String name;
    private String description;
    private String image;
    private String category;

    public static DiningMenuResponse from(DiningMenu menu) {
        return DiningMenuResponse.builder()
                .name(menu.getName())
                .description(menu.getDescription())
                .image(menu.getImage())
                .category(menu.getCategory())
                .build();
    }
}
