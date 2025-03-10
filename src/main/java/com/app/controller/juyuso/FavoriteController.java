package com.app.controller.juyuso;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.dto.juyuso.Juyuso;
import com.app.service.juyuso.FavoriteService;
import com.app.util.JwtProvider;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping
    public ResponseEntity<List<Juyuso>> getFavorites(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7); // "Bearer " 제거
        String userId = JwtProvider.getUserIdFromToken(token);
        
        if (userId == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        List<Juyuso> favorites = favoriteService.getFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/{juyusoId}")
    public ResponseEntity<Void> addFavorite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int juyusoId) {
        String token = authHeader.substring(7);
        String userId = JwtProvider.getUserIdFromToken(token);
        
        if (userId == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        favoriteService.addFavorite(userId, juyusoId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{juyusoId}")
    public ResponseEntity<Void> removeFavorite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int juyusoId) {
        String token = authHeader.substring(7);
        String userId = JwtProvider.getUserIdFromToken(token);
        
        if (userId == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        favoriteService.removeFavorite(userId, juyusoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{juyusoId}/check")
    public ResponseEntity<Boolean> checkFavorite(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable int juyusoId) {
        String token = authHeader.substring(7);
        String userId = JwtProvider.getUserIdFromToken(token);
        
        if (userId == null) {
            throw new RuntimeException("유효하지 않은 토큰입니다.");
        }

        boolean isFavorite = favoriteService.isFavorite(userId, juyusoId);
        return ResponseEntity.ok(isFavorite);
    }
} 