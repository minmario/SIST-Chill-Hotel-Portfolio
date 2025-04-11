package sist.backend.domain.restaurant.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import sist.backend.domain.restaurant.entity.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {

}
