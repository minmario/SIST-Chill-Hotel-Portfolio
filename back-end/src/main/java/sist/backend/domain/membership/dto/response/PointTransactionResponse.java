package sist.backend.domain.membership.dto.response;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PointTransactionResponse {
    private Long id; // ← point_transaction_idx
    private LocalDate date;
    private String category;
    private String description;
    private int earned;
    private int used;
    private int balance;

    private String referenceType;
    private Long referenceId;
}
