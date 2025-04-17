package sist.backend.domain.auth.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentMethodRequest {
    private String cardCompany;
    private String cardNumber;
    private String cardExpiry;
    private String cardHolder;
}