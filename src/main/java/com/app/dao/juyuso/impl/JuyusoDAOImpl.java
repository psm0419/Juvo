package com.app.dao.juyuso.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.juyuso.JuyusoDAO;
import com.app.dto.juyuso.BlackJuyuso;
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
   

    @Override
    public List<Map<String, Object>> getReviewsByStationId(String uniId) {
        List<Map<String, Object>> reviews = sqlSessionTemplate.selectList(NAMESPACE + "getReviewsByStationId", uniId);
        System.out.println("Raw reviews from DB for uniId " + uniId + ": " + reviews);
        return reviews;
    }

    @Override
    public List<Integer> getKeywordsByStationAndUser(String uniId, String userId) {
        Map<String, String> params = new HashMap<>();
        params.put("uniId", uniId);
        params.put("userId", userId);
        List<Integer> keywords = sqlSessionTemplate.selectList(NAMESPACE + "getKeywordsByStationAndUser", params);
        System.out.println("Raw keywords from DB for uniId " + uniId + ", userId " + userId + ": " + keywords);
        return keywords;
    }

    @Override
    public List<Map<String, Object>> getAllKeywordsStatsByStation(String uniId) {
        return sqlSessionTemplate.selectList(NAMESPACE + "getAllKeywordsStatsByStation", uniId);
    }
    @Override
    public int insertReview(Map<String, Object> review) {
        return sqlSessionTemplate.insert(NAMESPACE + "insertReview", review);
    }

    @Override
    public int insertKeyword(Map<String, Object> param) {
        return sqlSessionTemplate.insert(NAMESPACE + "insertKeyword", param);
    }
    
    @Override
    public int deleteReview(Map<String, Object> param) {
        return sqlSessionTemplate.delete(NAMESPACE + "deleteReview", param);
    }

    @Override
    public int deleteKeywordsByUserAndStation(Map<String, Object> param) {
        return sqlSessionTemplate.delete(NAMESPACE + "deleteKeywordsByUserAndStation", param);
    }
    
    @Override
	public List<BlackJuyuso> findProcessedAllBlackList() {
		
		List<BlackJuyuso> blackList = sqlSessionTemplate.selectList("juyuso_mapper.findProcessedAllBlackList");
		
		return blackList;
	}
    
    @Override
	public List<BlackJuyuso> findProcessedBlackList() {
		
		List<BlackJuyuso> blackList = sqlSessionTemplate.selectList("juyuso_mapper.findProcessedBlackList");
		
		return blackList;
	}

	@Override
	public List<BlackJuyuso> findBlackList() {
		
		List<BlackJuyuso> blackList = sqlSessionTemplate.selectList("juyuso_mapper.findBlackList");
		
		return blackList;
	}

	@Override
	public int modifyBlack(BlackJuyuso blackJuyuso) {
		
		int result = sqlSessionTemplate.update("juyuso_mapper.modifyBlack", blackJuyuso);
		
		return result;
	}

	@Override
	public int removeBlack(String uniId) {
		
		int result = sqlSessionTemplate.delete("juyuso_mapper.removeBlack", uniId); 
		
		return result;
	}
}