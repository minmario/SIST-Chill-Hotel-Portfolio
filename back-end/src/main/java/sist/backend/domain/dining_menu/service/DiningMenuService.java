package sist.backend.domain.dining_menu.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import sist.backend.domain.dining_menu.dto.response.DiningMenuResponse;
import sist.backend.domain.dining_menu.entity.DiningMenu;
import sist.backend.domain.dining_menu.repository.jpa.DiningMenuRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiningMenuService {

    private final DiningMenuRepository diningMenuRepository;

    public List<DiningMenuResponse> getMenusByRestaurantId(Long restaurantId) {
        List<DiningMenu> menus = diningMenuRepository.findByRestaurantId(restaurantId);
        return menus.stream()
                .map(DiningMenuResponse::from)
                .collect(Collectors.toList());
    }
}
