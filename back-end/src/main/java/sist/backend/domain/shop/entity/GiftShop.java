package sist.backend.domain.shop.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
    
    @Column(name = "image_url", length = 500)
    private String imageUrl;
    
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
    
    // 재고 수량 변경 메서드
    public void setStockQuantity(Integer stockQuantity) {
        // 재고는 음수가 될 수 없음
        if (stockQuantity < 0) {
            this.stockQuantity = 0;
        } else {
            this.stockQuantity = stockQuantity;
        }
    }
    
    // 재고 차감 메서드
    public boolean decreaseStock(int quantity) {
        if (this.stockQuantity < quantity) {
            return false; // 재고 부족
        }
        
        this.stockQuantity -= quantity;
        return true;
    }
}
