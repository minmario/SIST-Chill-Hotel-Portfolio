package sist.backend.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest; 

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
        log.warn("[RuntimeException] {}", ex.getMessage(), ex); // ํ ฝํดฅ ์ฌ๊ธฐ์ ์ ์ฒด ์คํ๊น์ง ์ถ๋ ฅ
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());

        if (ex.getMessage().contains("์์ด๋") || ex.getMessage().contains("์ด๋ฉ์ผ")) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGlobalException(Exception ex, HttpServletRequest request) {
        String uri = request.getRequestURI();
        // actuator ์์ฒญ์ด๋ฉด Spring ๊ธฐ๋ณธ ์ฒ๋ฆฌ๋ก ๋๊น
        if (uri.startsWith("/actuator")) {
            return null;
        }
    
        log.error("[Exception] URI: {} - {}", uri, ex.getMessage(), ex);
    
        Map<String, String> errorResponse = new HashMap<>();
        if (ex.getMessage() != null && ex.getMessage().contains("Row was updated or deleted by another transaction")) {
            errorResponse.put("message", "์ด๋ฏธ ์ฒ๋ฆฌ๋ ์์ฒญ์ด๊ฑฐ๋, ๋ค๋ฅธ ํธ๋์ญ์์ ์ํด ๋ณ๊ฒฝ๋ ๋ฐ์ดํฐ์๋๋ค. ์๋ก๊ณ ์นจ ํ ๋ค์ ์๋ํด์ฃผ์ธ์.");
            return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }
        errorResponse.put("message", "์๋ฒ ๋ด๋ถ ์ค๋ฅ๊ฐ ๋ฐ์ํ์ต๋๋ค. ์ ์ ํ ๋ค์ ์๋ํด ์ฃผ์ธ์.");
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
