package com.app.dao.chargingstation.Impl;

import java.util.List;

import org.mybatis.spring.SqlSessionTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.app.dao.chargingstation.ChargingStationDAO;
import com.app.dto.chargingstation.ChargingStation;

@Repository
public class ChargingStationDAOImpl implements ChargingStationDAO {

    @Autowired
    private SqlSessionTemplate sqlSessionTemplate;

    private static final String NAMESPACE = "chargingStation_mapper";

    @Override
    public void insertChargingStation(ChargingStation dto) {
        sqlSessionTemplate.insert(NAMESPACE + ".insertChargingStation", dto);
    }

    @Override
    public List<ChargingStation> selectBySido(List<String> sidoList) {
        return sqlSessionTemplate.selectList( NAMESPACE + ".selectBySido", sidoList);
    }
    
    @Override
    public List<String> selectAllSido() {
        return sqlSessionTemplate.selectList( NAMESPACE + ".selectAllSido");
    }
}
    