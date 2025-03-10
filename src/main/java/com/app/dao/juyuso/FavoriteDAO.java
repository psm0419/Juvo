package com.app.dao.juyuso;

import java.util.List;
import com.app.dto.juyuso.Favorite;
import com.app.dto.juyuso.Juyuso;

public interface FavoriteDAO {
    List<Juyuso> getFavoritesByUserId(String userId);
    void addFavorite(Favorite favorite);
    void deleteFavorite(String userId, int juyusoId);
    boolean existsFavorite(String userId, int juyusoId);
} 