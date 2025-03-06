package com.app.service.juyuso.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.app.dao.juyuso.JuyusoDAO;
import com.app.dto.juyuso.Juyuso;
import com.app.service.juyuso.JuyusoService;

@Service
public class JuyusoServiceImpl implements JuyusoService{

	@Autowired
    private JuyusoDAO juyusoDAO;

    @Override
    public boolean insertJuyuso(Juyuso juyuso) {
        return juyusoDAO.insertJuyuso(juyuso);
    }

    @Override
    public Juyuso getJuyusoById(String uniId) {
        return juyusoDAO.getJuyusoById(uniId);
    }

    @Override
    public List<Juyuso> getAllJuyuso() {
        return juyusoDAO.getAllJuyuso();
    }

    @Override
    public boolean updateJuyuso(Juyuso juyuso) {
        return juyusoDAO.updateJuyuso(juyuso);
    }

    @Override
    public boolean deleteJuyuso(String uniId) {
        return juyusoDAO.deleteJuyuso(uniId);
    }

	
}
