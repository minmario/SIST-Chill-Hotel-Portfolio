package sist.backend.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import sist.backend.domain.shop.exception.custom.ResourceNotFoundException;
import sist.backend.global.exception.NotFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({ ResourceNotFoundException.class, NotFoundException.class })
    public ResponseEntity<Map<String, String>> handleNotFound(RuntimeException ex) {
        log.warn("[NotFoundException] {}", ex.getMessage());
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.warn("[ValidationException] {}", ex.getMessage());
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntimeException(RuntimeException ex) {
        log.warn("[RuntimeException] {}", ex.getMessage(), ex); // ������ 여기에 전체 스택까지 출력
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        if (ex.getMessage().contains("아이디") || ex.getMessage().contains("이메일")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex) {
        log.error("[Exception] {}", ex.getMessage(), ex); // ������ 여기서 반드시 스택 출력
        Map<String, String> errorResponse = new HashMap<>();
        if (ex.getMessage() != null && ex.getMessage().contains("Row was updated or deleted by another transaction")) {
            errorResponse.put("message", "이미 처리된 요청이거나, 다른 트랜잭션에 의해 변경된 데이터입니다. 새로고침 후 다시 시도해주세요.");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
        errorResponse.put("message", "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
