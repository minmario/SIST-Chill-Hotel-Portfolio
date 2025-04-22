package sist.backend.domain.shop.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileUploadService {
    String uploadFile(MultipartFile file);
    void deleteFile(String fileUrl);
} 