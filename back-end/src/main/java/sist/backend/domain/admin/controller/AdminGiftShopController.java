package sist.backend.domain.admin.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.dto.request.GiftShopRequestDTO;
import sist.backend.domain.shop.dto.response.GiftShopResponseDTO;
import sist.backend.domain.shop.service.interfaces.GiftShopService;
import sist.backend.infrastructure.logging.ActivityType;
import sist.backend.domain.admin.service.AdminActivityLogService;



@Slf4j
@RestController
@RequestMapping("/api/v1/admin/gift-shop")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true") // 개발 환경에서는 프론트엔드 서버 주소 지정
public class AdminGiftShopController {

    private final GiftShopService giftShopService;
    private final AdminActivityLogService adminActivityLogService;

    private String extractClientIp(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    @GetMapping
    public ResponseEntity<List<GiftShopResponseDTO>> getAllItems() {
        log.info("관리자: 모든 상품 조회 요청");
        List<GiftShopResponseDTO> products = giftShopService.getAllProducts();
        log.info("관리자: 전체 상품 {} 개 조회 완료", products.size());
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{itemIdx}")
    public ResponseEntity<GiftShopResponseDTO> getItemById(@PathVariable Long itemIdx) {
        log.info("관리자: 상품 상세 조회 요청 - ID: {}", itemIdx);
        GiftShopResponseDTO product = giftShopService.getItemById(itemIdx);
        log.info("관리자: 상품 상세 조회 완료 - {}", product.getItemName());
        return ResponseEntity.ok(product);
    }

    @PostMapping
    public ResponseEntity<GiftShopResponseDTO> createItem(@Valid @RequestBody GiftShopRequestDTO requestDto, HttpServletRequest request) {
        log.info("관리자: 상품 생성 요청 - {}", requestDto.getItemName());
        GiftShopResponseDTO createdProduct = giftShopService.createItem(requestDto);
        log.info("관리자: 상품 생성 완료 - ID: {}", createdProduct.getItemIdx());
        // 관리자 활동 로그 기록
        org.springframework.security.core.Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId = authentication.getName();
        String ip = extractClientIp(request);
        adminActivityLogService.logActivity(adminId, sist.backend.infrastructure.logging.ActivityType.ADMIN_GIFT_CREATE, "상품 생성: " + createdProduct.getItemName(), ip);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/{itemIdx}")
    public ResponseEntity<GiftShopResponseDTO> updateItem(
            @PathVariable("itemIdx") Long itemIdx,
            @Valid @RequestBody GiftShopRequestDTO requestDto,
            HttpServletRequest request) {
        log.info("관리자: 상품 수정 요청 - ID: {}, 이름: {}", itemIdx, requestDto.getItemName());
        GiftShopResponseDTO updatedProduct = giftShopService.updateItem(itemIdx, requestDto);
        log.info("관리자: 상품 수정 완료 - ID: {}", updatedProduct.getItemIdx());
        // 관리자 활동 로그 기록
        org.springframework.security.core.Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String adminId = authentication.getName();
        String ip = extractClientIp(request);
        adminActivityLogService.logActivity(adminId, sist.backend.infrastructure.logging.ActivityType.ADMIN_GIFT_UPDATE, "상품 수정: " + updatedProduct.getItemName(), ip);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{itemIdx}")
    public ResponseEntity<Void> deleteItem(@PathVariable("itemIdx") Long itemIdx, HttpServletRequest request) {
        log.info("관리자: 상품 삭제 요청 - ID: {}", itemIdx);
        try {
            giftShopService.deleteItem(itemIdx);
            log.info("관리자: 상품 삭제 완료 - ID: {}", itemIdx);
            // 관리자 활동 로그 기록
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String adminId = authentication.getName();
            String ip = extractClientIp(request);
            adminActivityLogService.logActivity(adminId, ActivityType.ADMIN_GIFT_DELETE, "상품 삭제: ID=" + itemIdx, ip);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException e) {
            // 주문에 포함된 상품 삭제 시도 시
            log.warn("관리자: 상품 삭제 실패 (주문 내역에 포함됨) - ID: {}, 오류: {}", itemIdx, e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(null); // 409 Conflict 상태 코드 반환
        } catch (Exception e) {
            log.error("관리자: 상품 삭제 중 오류 발생 - ID: {}, 오류: {}", itemIdx, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null); // 500 Internal Server Error 상태 코드 반환
        }
    }
    
    @DeleteMapping("/bulk")
    public ResponseEntity<Void> bulkDeleteItems(@RequestParam List<Long> itemIds) {
        log.info("관리자: 상품 일괄 삭제 요청 - 항목 수: {}", itemIds.size());
        try {
            for (Long itemId : itemIds) {
                try {
                    giftShopService.deleteItem(itemId);
                    log.info("관리자: 상품 삭제 완료 - ID: {}", itemId);
                } catch (IllegalStateException e) {
                    // 주문에 포함된 상품은 건너뛰고 계속 진행
                    log.warn("관리자: 상품 삭제 실패 (주문 내역에 포함됨) - ID: {}, 오류: {}", itemId, e.getMessage());
                } catch (Exception e) {
                    log.error("관리자: 상품 삭제 중 오류 발생 - ID: {}, 오류: {}", itemId, e.getMessage());
                }
            }
            log.info("관리자: 상품 일괄 삭제 완료");
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("관리자: 상품 일괄 삭제 중 오류 발생, 오류: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(null); // 500 Internal Server Error 상태 코드 반환
        }
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<List<GiftShopResponseDTO>> getLowStockItems(
            @RequestParam(defaultValue = "10") Integer threshold) {
        log.info("관리자: 재고 부족 상품 조회 요청 - 기준치: {}", threshold);
        List<GiftShopResponseDTO> lowStockItems = giftShopService.getLowStockItems(threshold);
        log.info("관리자: 재고 부족 상품 {} 개 조회 완료", lowStockItems.size());
        return ResponseEntity.ok(lowStockItems);
    }
} 