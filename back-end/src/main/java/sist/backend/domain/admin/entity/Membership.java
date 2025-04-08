package sist.backend.domain.admin.entity;

import lombok.*;
import jakarta.persistence.*;

@Entity
@Table(name = "membership")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Membership {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "membership_idx")
    private Long id;

    @Column(name = "membership_num", nullable = false, unique = true, length = 20)
    private String membershipNum;

    @Column(name = "user_idx", nullable = false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tier tier;

    @Column(name = "required_point", nullable = false)
    private int requiredPoint;

    @Column(name = "required_stays", nullable = false)
    private int requiredStays;

    public enum Tier {
        BASIC, PREMIUM, VIP
    }
}
