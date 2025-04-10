package sist.backend.domain.admin.entity;

import lombok.*;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "membership_discount")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MembershipDiscount {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "membership_discount_idx")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tier tier;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType type;

    @Column(name = "discount_percentage", nullable = false)
    private BigDecimal discountPercentage;

    public enum Tier {
        BASIC, PREMIUM, VIP
    }

    public enum DiscountType {
        room, dining, store
    }
}
