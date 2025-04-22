package sist.backend.domain.shop.service.impl;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import sist.backend.domain.shop.service.interfaces.FileUploadService;
import sist.backend.global.exception.BadRequestException;

@Slf4j
@Service
@RequiredArgsConstructor
public class S3FileUploadService implements FileUploadService {

    private final S3Client s3Client;

    @Value("${spring.cloud.aws.s3.bucket-name}")
    private String bucket;

    @Override
    public String uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new BadRequestException("파일이 비어있습니다.");
        }

        String originalFilename = file.getOriginalFilename();
        String fileExtension = getFileExtension(originalFilename);
        
        // 파일 확장자 검증 (이미지 파일만 허용)
        validateFileExtension(fileExtension);
        
        // 파일명 중복 방지를 위한 유니크한 이름 생성
        String fileName = createFileName(originalFilename);
        String folderName = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
        String filePath = "images/products/" + folderName + "/" + fileName;

        try (InputStream inputStream = file.getInputStream()) {
            // S3에 업로드
            PutObjectRequest request = PutObjectRequest.builder()
                .bucket(bucket)
                .key(filePath)
                .contentType(file.getContentType())
                .build();
                
            s3Client.putObject(request, RequestBody.fromInputStream(inputStream, file.getSize()));
            
            // 업로드된 파일의 URL 생성
            String fileUrl = "https://" + bucket + ".s3." + s3Client.serviceClientConfiguration().region() + ".amazonaws.com/" + filePath;
            log.info("파일 업로드 성공: {}", fileUrl);
            return fileUrl;
        } catch (IOException e) {
            log.error("파일 업로드 실패: {}", e.getMessage(), e);
            throw new BadRequestException("파일 업로드에 실패했습니다: " + e.getMessage());
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        try {
            // URL에서 키 추출
            String key = extractKeyFromUrl(fileUrl);
            
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();
                
            s3Client.deleteObject(request);
            log.info("파일 삭제 성공: {}", key);
        } catch (Exception e) {
            log.error("파일 삭제 실패: {}", e.getMessage(), e);
            throw new BadRequestException("파일 삭제에 실패했습니다: " + e.getMessage());
        }
    }

    // 기존 유틸리티 메서드들은 그대로 유지
    private String createFileName(String originalFilename) {
        return UUID.randomUUID().toString() + "_" + originalFilename;
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty() || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }

    private void validateFileExtension(String extension) {
        if (!isImageFile(extension)) {
            throw new BadRequestException("이미지 파일만 업로드할 수 있습니다. (jpg, jpeg, png, gif)");
        }
    }

    private boolean isImageFile(String extension) {
        return extension.equalsIgnoreCase("jpg") || 
               extension.equalsIgnoreCase("jpeg") || 
               extension.equalsIgnoreCase("png") || 
               extension.equalsIgnoreCase("gif");
    }

    private String extractKeyFromUrl(String fileUrl) {
        // URL에서 버킷 이름 이후의 경로를 추출
        // 예: https://bucket-name.s3.region.amazonaws.com/images/products/2023/01/01/file.jpg
        // 에서 images/products/2023/01/01/file.jpg 추출
        String bucketUrl = "https://" + bucket + ".s3.";
        if (fileUrl.contains(bucketUrl)) {
            int endIndex = fileUrl.indexOf(".amazonaws.com/") + ".amazonaws.com/".length();
            return fileUrl.substring(endIndex);
        }
        
        // URL 형식이 다른 경우
        String[] parts = fileUrl.split("/");
        return String.join("/", java.util.Arrays.copyOfRange(parts, 3, parts.length));
    }
}