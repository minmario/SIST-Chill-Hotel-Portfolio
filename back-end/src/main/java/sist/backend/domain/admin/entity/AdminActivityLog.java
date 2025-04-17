package sist.backend.domain.admin.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_activity_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminActivityLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logIdx;

    @Column(nullable = false, length = 100)
    private String adminId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private sist.backend.infrastructure.logging.ActivityType activityType;

    @Column(columnDefinition = "TEXT")
    private String activityDetails;

    @Column(length = 45)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
