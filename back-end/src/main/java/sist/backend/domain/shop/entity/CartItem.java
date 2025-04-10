package sist.backend.domain.shop.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cart_items")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cart_item_idx")
    private Long cartItemIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_idx")
    @Setter
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_idx")
    private GiftShop item;

    @Column(nullable = false)
    private Integer quantity;
    
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * 수량 업데이트 메서드
     */
    public void setQuantity(Integer quantity) {
        if (quantity < 1) {
            throw new IllegalArgumentException("수량은 1 이상이어야 합니다.");
        }
        this.quantity = quantity;
    }
    
    /**
     * 가격 설정 메서드
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    /**
     * 장바구니 항목의 소계 계산 (가격 * 수량)
     */
    public BigDecimal calculateSubtotal() {
        // price 필드가 있으면 그것을 사용하고, 없으면 item의 price를 사용
        BigDecimal itemPrice = (this.price != null) ? this.price : 
                               (this.item != null ? this.item.getPrice() : BigDecimal.ZERO);
                               
        if (quantity == null) {
            return BigDecimal.ZERO;
        }
        
        return itemPrice.multiply(BigDecimal.valueOf(quantity));
    }
}
