package sist.backend.domain.shop.entity;

import java.math.BigDecimal;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
<<<<<<< HEAD
=======
import sist.backend.global.common.BaseTimeEntity;
>>>>>>> vldhtmxk

@Entity
@Table(name = "gift_shop")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class GiftShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_idx")
    private Long itemIdx;

    @Column(name = "item_name", nullable = false, length = 100)
    private String itemName;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity;

    @Column(length = 50)
    private String category;
<<<<<<< HEAD
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
=======
>>>>>>> vldhtmxk
}
