package com.app.service.juyuso;

import java.util.List;
import com.app.dto.juyuso.Juyuso;

public interface FavoriteService {
    List<Juyuso> getFavorites(String userId);
    void addFavorite(String userId, int juyusoId);
    void removeFavorite(String userId, int juyusoId);
    boolean isFavorite(String userId, int juyusoId);
} 