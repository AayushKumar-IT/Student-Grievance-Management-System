package com.grievance.management.util;

import com.grievance.management.exception.ResourceNotFoundException;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileStorageUtil {

    private final Path uploadDir = Paths.get("uploads");

    public String storeFile(MultipartFile file, String subDir) {
        try {
            Path targetDir = uploadDir.resolve(subDir);
            Files.createDirectories(targetDir);

            String originalFilename = file.getOriginalFilename();
            String extension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                    : "";
            String fileName = UUID.randomUUID() + extension;
            Path targetPath = targetDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return subDir + "/" + fileName;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage());
        }
    }

    public Resource loadFileAsResource(String filePath) {
        try {
            Path path = uploadDir.resolve(filePath).normalize();
            Resource resource = new UrlResource(path.toUri());
            if (resource.exists()) return resource;
            throw new ResourceNotFoundException("File not found: " + filePath);
        } catch (MalformedURLException e) {
            throw new ResourceNotFoundException("File not found: " + filePath);
        }
    }

    public void deleteFile(String filePath) {
        try {
            Path path = uploadDir.resolve(filePath).normalize();
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file: " + e.getMessage());
        }
    }
}
