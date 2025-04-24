package sist.backend.domain.dining_menu.entity;

import jakarta.persistence.*;
import lombok.*;
import sist.backend.global.common.BaseTimeEntity;

@Entity
@Table(name = "dining_menu")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class DiningMenu extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 255)
    private String image;

    @Column(name = "category", length = 50)
    private String category;
}
