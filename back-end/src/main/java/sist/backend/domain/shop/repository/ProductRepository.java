package sist.backend.domain.shop.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.shop.entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
} 