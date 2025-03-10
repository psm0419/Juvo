package com.app.service.juyuso;

import java.util.List;
import java.util.Map;

import com.app.dto.juyuso.Juyuso;

public interface JuyusoService {
	
    boolean insertJuyuso(Juyuso juyuso);
    Juyuso getJuyusoById(String uniId);
    List<Juyuso> getAllJuyuso();
    boolean updateJuyuso(Juyuso juyuso);
    boolean deleteJuyuso(String uniId);
    boolean fetchAndSaveJuyusoData(double lat, double lng);
    boolean updateJuyusoDetail(String uniId);
    String getJuyusoWithDetails(double lat, double lng);
    boolean registerFavoriteStation(String userId, String uniId);
    Map<String, Object> getReviewsByStationId(String uniId);
    List<Integer> getKeywordsByStationAndUser(String uniId, String userId);
    Map<Integer, Integer> getAllKeywordsCountByStation(String uniId);
    boolean saveReview(String userId, String uniId, String content, double starCnt);
    boolean saveKeywords(String userId, String uniId, List<Integer> keywords);
    boolean deleteReview(String userId, String uniId, String content);
}