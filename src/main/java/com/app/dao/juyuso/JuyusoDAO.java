package com.app.dao.juyuso;

import java.util.List;

import com.app.dto.juyuso.Juyuso;
import com.app.dto.juyuso.LikeJuyuso;

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
}
