package com.workmates.backend.web.controller;

import java.io.IOException;
import java.nio.file.*;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/files")
public class FileController {
    
    private final Path PATH = Paths.get(System.getProperty("user.dir") + "/uploads");

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> serveFile(@PathVariable String filename) {
        try {
            Path file = PATH.resolve(filename).normalize();

            if (!file.startsWith(PATH)) {
                return ResponseEntity.badRequest().build(); // 탐색 공격 차단
            }

            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType;
                try {
                    contentType = Files.probeContentType(file);
                } catch (IOException e) {
                    contentType = "application/octet-stream";
                }
                return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
