package com.app.dao.juyuso.impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.juyuso.JuyusoDAO;
import com.app.dto.juyuso.Juyuso;

@Repository
public class JuyusoDAOImpl implements JuyusoDAO{

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

}
