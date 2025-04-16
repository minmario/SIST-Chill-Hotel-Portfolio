package sist.backend.domain.admin.dto.request;

import lombok.Getter;

@Getter
public class UpdateStatusRequest {
    private String status; // "active" 또는 "inactive"
}
