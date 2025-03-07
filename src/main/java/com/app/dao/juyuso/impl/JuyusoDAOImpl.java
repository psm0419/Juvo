package com.app.dao.juyuso.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.juyuso.JuyusoDAO;
import com.app.dto.juyuso.Juyuso;
import com.app.dto.juyuso.LikeJuyuso;

@Repository
public class JuyusoDAOImpl implements JuyusoDAO {

    @Autowired
    SqlSessionTemplate sqlSessionTemplate;

    private static final String NAMESPACE = "juyuso_mapper.";

    @Override
    public boolean insertJuyuso(Juyuso juyuso) {
        return sqlSessionTemplate.insert(NAMESPACE + "insertJuyuso", juyuso) > 0;
    }

    @Override
    public Juyuso getJuyusoById(String uniId) {
        return sqlSessionTemplate.selectOne(NAMESPACE + "getJuyusoById", uniId);
    }

    @Override
    public List<Juyuso> getAllJuyuso() {
        return sqlSessionTemplate.selectList(NAMESPACE + "getAllJuyuso");
    }

    @Override
    public boolean updateJuyuso(Juyuso juyuso) {
        return sqlSessionTemplate.update(NAMESPACE + "updateJuyuso", juyuso) > 0;
    }

    @Override
    public boolean deleteJuyuso(String uniId) {
        return sqlSessionTemplate.delete(NAMESPACE + "deleteJuyuso", uniId) > 0;
    }

    @Override
    public boolean existsById(String uniId) {
        Integer count = sqlSessionTemplate.selectOne(NAMESPACE + "existsById", uniId);
        return count != null && count > 0;
    }

    @Override
    public boolean updateJuyusoDetail(Juyuso juyuso) {
        return sqlSessionTemplate.update(NAMESPACE + "updateJuyusoDetail", juyuso) > 0;
    }

    @Override
    public boolean existsDetailById(String uniId) {
        Integer count = sqlSessionTemplate.selectOne(NAMESPACE + "existsDetailById", uniId);
        return count != null && count > 0;
    }

    @Override
    public boolean insertFavoriteStation(LikeJuyuso likeJuyuso) {
        return sqlSessionTemplate.insert(NAMESPACE + "insertFavoriteStation", likeJuyuso) > 0;
    }

    @Override
    public int checkFavoriteStationExists(String userId, String uniId) {
        Map<String, String> params = new HashMap<>();
        params.put("userId", userId);
        params.put("uniId", uniId);
        Integer count = sqlSessionTemplate.selectOne(NAMESPACE + "checkFavoriteStationExists", params);
        return count != null ? count : 0; // null 체크 후 기본값 0 반환
    }
}