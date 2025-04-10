// package sist.backend.infrastructure.logging;

// import java.time.LocalDateTime;
// import jakarta.persistence.Column;
// import jakarta.persistence.Entity;
// import jakarta.persistence.EnumType;
// import jakarta.persistence.Enumerated;
// import jakarta.persistence.FetchType;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;
// import lombok.AccessLevel;
// import lombok.AllArgsConstructor;
// import lombok.Builder;
// import lombok.Getter;
// import lombok.NoArgsConstructor;
// import sist.backend.domain.user.entity.User;

// @Entity
// @Table(name = "user_activity_log")
// @Getter
// @NoArgsConstructor(access = AccessLevel.PROTECTED)
// @AllArgsConstructor
// @Builder
// public class UserActivityLog2 {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long logIdx;

//     @ManyToOne(fetch = FetchType.LAZY)
//     @JoinColumn(name = "user_idx", nullable = false)
//     private User user;

//     @Enumerated(EnumType.STRING)
//     @Column(nullable = false)
//     private ActivityType activityType;

//     @Column(columnDefinition = "TEXT")
//     private String activityDetails;

//     @Column(length = 45)
//     private String ipAddress;

//     @Column(nullable = false)
//     private LocalDateTime createdAt;
// }
