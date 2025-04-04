package sist.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import sist.backend.entity.enums.ActivityType;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity_log")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logIdx;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_idx", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType activityType;

    @Column(columnDefinition = "TEXT")
    private String activityDetails;

    @Column(length = 45)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}