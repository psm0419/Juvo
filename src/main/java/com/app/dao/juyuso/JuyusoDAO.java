package com.app.dao.juyuso;

import java.util.List;

import com.app.dto.juyuso.Juyuso;

public interface JuyusoDAO {

	boolean insertJuyuso(Juyuso juyuso);
    Juyuso getJuyusoById(String uniId);
    List<Juyuso> getAllJuyuso();
    boolean updateJuyuso(Juyuso juyuso);
    boolean deleteJuyuso(String uniId);
}
