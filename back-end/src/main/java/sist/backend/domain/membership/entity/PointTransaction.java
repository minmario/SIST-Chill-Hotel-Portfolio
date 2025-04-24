package sist.backend.domain.membership.entity;

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
import sist.backend.domain.user.entity.User;
import sist.backend.global.common.BaseTimeEntity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

@Entity
@Table(name = "point_transaction")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PointTransaction extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pointTransactionIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @Column(nullable = false)
    private Integer point;

    private Long referenceIdx;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private ReferenceType referenceType;

    @Column(nullable = false)
    private LocalDateTime transactionDate;

    @Column(length = 255)
    private String description;

    @Column(nullable = false)
    private LocalDateTime expirationDate;

    // 정적 팩토리 메서드
    public static PointTransaction createTransaction(
            User user,
            Integer point,
            ReferenceType referenceType,
            Long referenceIdx,
            String description) {
        return PointTransaction.builder()
                .user(user)
                .point(point)
                .referenceType(referenceType)
                .referenceIdx(referenceIdx)
                .transactionDate(LocalDateTime.now())
                .description(description)
                .build();
    }
}