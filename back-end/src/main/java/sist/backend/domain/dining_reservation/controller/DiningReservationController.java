package sist.backend.domain.dining_reservation.controller;

import lombok.RequiredArgsConstructor;
import sist.backend.domain.dining_reservation.dto.DiningReservationRequest;
import sist.backend.domain.dining_reservation.entity.DiningReservation;
import sist.backend.domain.dining_reservation.service.interfaces.DiningReservationService;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/dining/reservation")
@RequiredArgsConstructor
@CrossOrigin // 프론트엔드와 연결 시 CORS 허용
public class DiningReservationController {

    private final DiningReservationService reservationService;

    @PostMapping
    public ResponseEntity<DiningReservation> createReservation(@RequestBody @Valid DiningReservationRequest request) {
        DiningReservation reservation = reservationService.fromDTO(request);
        DiningReservation saved = reservationService.save(reservation);
        return ResponseEntity.ok(saved);
    }

    @Configuration
    public class WebConfig {
        @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurer() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                            .allowedOrigins("http://localhost:3000")
                            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                            .allowedHeaders("*")
                            .allowCredentials(true);
                }
            };
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Integer>> getReservedCount(
            @RequestParam Long restaurantId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(pattern = "HH:mm") LocalTime time) {
        int totalPeople = reservationService.getReservedPeopleCount(restaurantId, date, time);
        return ResponseEntity.ok(Map.of("totalPeople", totalPeople));
    }

}