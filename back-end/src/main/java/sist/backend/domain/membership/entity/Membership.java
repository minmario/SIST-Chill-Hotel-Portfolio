package sist.backend.domain.membership.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import sist.backend.global.common.BaseTimeEntity;

@Entity
@Table(name = "membership")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Membership extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long membershipIdx;

    @Column(unique = true, nullable = false, length = 20)
    private String membershipNumber;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MembershipTier tier;

    @Column(nullable = false)
    private Integer requiredPoint;

    @Column(nullable = false)
    private Integer requiredStays;
    @Column(name = "save_percent")
    private int savePercent;

    // 비즈니스 메서드
    public void upgradeTier(MembershipTier tier) {
        this.tier = tier;
    }

    public void updateRequirements(Integer requiredPoint, Integer requiredStays) {
        this.requiredPoint = requiredPoint;
        this.requiredStays = requiredStays;
    }
}
