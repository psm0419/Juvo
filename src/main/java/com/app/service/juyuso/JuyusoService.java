package com.app.service.juyuso;

import java.util.List;
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
}