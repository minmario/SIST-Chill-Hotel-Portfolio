package sist.backend.domain.restaurant.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import sist.backend.domain.restaurant.entity.Restaurant;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Page<Restaurant> findAll(Pageable pageable); // ✅ Page 반환형 확인

    Page<Restaurant> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            String nameKeyword,
            String descriptionKeyword,
            Pageable pageable);
}
