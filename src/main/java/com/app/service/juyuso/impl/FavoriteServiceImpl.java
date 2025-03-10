package com.app.service.juyuso.impl;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.juyuso.FavoriteDAO;
import com.app.dto.juyuso.LikeJuyuso;
import com.app.dto.juyuso.Juyuso;
import com.app.service.juyuso.FavoriteService;

@Service
public class FavoriteServiceImpl implements FavoriteService {

    @Autowired
    private FavoriteDAO favoriteDAO;

    @Override
    public List<Juyuso> getFavorites(String userId) {
        return favoriteDAO.getFavoritesByUserId(userId);
    }

    @Override
    public void addFavorite(String userId, int juyusoId) {
        if (favoriteDAO.existsFavorite(userId, juyusoId)) {
            throw new RuntimeException("이미 즐겨찾기에 추가된 주유소입니다.");
        }

        LikeJuyuso favorite = new LikeJuyuso();
        favorite.setUser_id(userId);
        favorite.setUni_id(juyusoId);
        favoriteDAO.addFavorite(favorite);
    }

    @Override
    public void removeFavorite(String userId, int juyusoId) {
        if (!favoriteDAO.existsFavorite(userId, juyusoId)) {
            throw new RuntimeException("즐겨찾기에 존재하지 않는 주유소입니다.");
        }
        favoriteDAO.deleteFavorite(userId, juyusoId);
    }

    @Override
    public boolean isFavorite(String userId, int juyusoId) {
        return favoriteDAO.existsFavorite(userId, juyusoId);
    }
} 