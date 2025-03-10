package com.app.dao.juyuso.impl;

import java.util.List;
import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.juyuso.FavoriteDAO;
import com.app.dto.juyuso.LikeJuyuso;
import com.app.dto.juyuso.Juyuso;

@Repository
public class FavoriteDAOImpl implements FavoriteDAO {
    
    @Autowired
    private SqlSessionTemplate sqlSessionTemplate;

    @Override
    public List<Juyuso> getFavoritesByUserId(String userId) {
        return sqlSessionTemplate.selectList("favorite_mapper.getFavoritesByUserId", userId);
    }

    @Override
    public void addFavorite(LikeJuyuso favorite) {
        sqlSessionTemplate.insert("favorite_mapper.addFavorite", favorite);
    }

    @Override
    public void deleteFavorite(String userId, int juyusoId) {
        LikeJuyuso favorite = new LikeJuyuso();
        favorite.setUser_id(userId);
        favorite.setUni_id(juyusoId);
        sqlSessionTemplate.delete("favorite_mapper.deleteFavorite", favorite);
    }

    @Override
    public boolean existsFavorite(String userId, int juyusoId) {
        LikeJuyuso favorite = new LikeJuyuso();
        favorite.setUser_id(userId);
        favorite.setUni_id(juyusoId);
        Integer count = sqlSessionTemplate.selectOne("favorite_mapper.existsFavorite", favorite);
        return count != null && count > 0;
    }
} 