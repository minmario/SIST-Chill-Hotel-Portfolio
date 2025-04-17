package sist.backend.domain.payment.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.payment.entity.PaymentMethod;

public interface PaymentMethodRepository extends JpaRepository<PaymentMethod, Long> {
}