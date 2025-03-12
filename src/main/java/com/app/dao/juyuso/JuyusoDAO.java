package com.app.dao.juyuso;

import java.util.List;
import java.util.Map;

import com.app.dto.juyuso.BlackJuyuso;
import com.app.dto.juyuso.Juyuso;
import com.app.dto.juyuso.LikeJuyuso;
import com.app.dto.user.User;

public interface JuyusoDAO {

	boolean insertJuyuso(Juyuso juyuso);
    Juyuso getJuyusoById(String uniId);
    List<Juyuso> getAllJuyuso();
    boolean updateJuyuso(Juyuso juyuso);
    boolean deleteJuyuso(String uniId);
    
    boolean existsById(String uniId);    
    boolean updateJuyusoDetail(Juyuso juyuso);
    boolean existsDetailById(String uniId);
    boolean insertFavoriteStation(LikeJuyuso likeJuyuso);
    int checkFavoriteStationExists(String userId, String uniId);
    List<Map<String, Object>> getReviewsByStationId(String uniId);
    List<Integer> getKeywordsByStationAndUser(String uniId, String userId);
    List<Map<String, Object>> getAllKeywordsStatsByStation(String uniId);
    int insertReview(Map<String, Object> review);
    int insertKeyword(Map<String, Object> param);
    int deleteReview(Map<String, Object> param);
    int deleteKeywordsByUserAndStation(Map<String, Object> param);
	List<String> getFavoriteJuyuso(String userId);
	boolean deleteFavoriteStation(String userId, String uniId);
    
    //관리자
    public List<BlackJuyuso> findProcessedBlackList();
    public List<BlackJuyuso> findBlackList();
    public int modifyBlack(BlackJuyuso blackJuyuso);
	public int removeBlack(String uniId);
}
