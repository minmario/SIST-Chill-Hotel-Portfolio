package sist.backend.global.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import sist.backend.domain.shop.exception.custom.ResourceNotFoundException;
import sist.backend.global.exception.NotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * ✅ 커스텀 예외 처리 - 존재하지 않는 자원
     */
    @ExceptionHandler({ ResourceNotFoundException.class, NotFoundException.class })
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    /**
     * ✅ 유효성 검사 실패 처리
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * ✅ 런타임 예외 처리 - 아이디/이메일 중복 체크 포함
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        if (ex.getMessage().contains("아이디") || ex.getMessage().contains("이메일")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // 409 Conflict
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    /**
     * ✅ 그 외 모든 예외 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();
        // Hibernate/JPA 예외 메시지 노출 방지 및 사용자 친화적 메시지 제공
        if (ex.getMessage() != null && ex.getMessage().contains("Row was updated or deleted by another transaction")) {
            errorResponse.put("message", "이미 처리된 요청이거나, 다른 트랜잭션에 의해 변경된 데이터입니다. 새로고침 후 다시 시도해주세요.");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
        errorResponse.put("message", "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
