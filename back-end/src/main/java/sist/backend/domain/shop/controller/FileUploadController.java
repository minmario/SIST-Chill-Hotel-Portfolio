package sist.backend.domain.shop.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import sist.backend.domain.shop.service.interfaces.FileUploadService;

@Slf4j
@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        log.info("파일 업로드 요청: {}", file.getOriginalFilename());
        String fileUrl = fileUploadService.uploadFile(file);
        
        return ResponseEntity.ok(fileUrl);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteFile(@RequestParam("fileUrl") String fileUrl) {
        log.info("파일 삭제 요청: {}", fileUrl);
        fileUploadService.deleteFile(fileUrl);
        
        return ResponseEntity.noContent().build();
    }
} 