package sist.backend.domain.dining_menu.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import sist.backend.domain.dining_menu.entity.DiningMenu;

import java.util.List;

public interface DiningMenuRepository extends JpaRepository<DiningMenu, Long> {
    List<DiningMenu> findByRestaurantId(Long restaurantId);
}
